import { Request, Response, NextFunction, Router } from "express";

import { UserBuilder } from "../domain/builders/UserBuilder";
import { Session } from "../domain/Session";
import { authMiddleware } from "../middlewares/auth";

const userController = Router();

async function meMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.remoteAddress?.includes("127.0.0.1") || req.remoteAddress?.includes("::1")
    ? (req.headers?.token ?? req.cookies?.token)
    : req.cookies?.token;

  if (!token)
    return res.status(401).json({ ok: false, message: "Unauthorized" });

  const user = await req.db("sessions")
    .select("users.user_type")
    .join("users", "sessions.user_id", "users.id")
    .where("sessions.id", token)
    .first();

  if (!user)
    return res.sendStatus(401);

  req.user = user;
  req.params.userType = user.user_type;

  return authMiddleware(user.user_type)(req, res, next);
}

userController.get("/me", meMiddleware, async (req, res) => {
  // @ts-expect-error FIX: use a mapper from db
  delete req.user.password_hash;

  // @ts-expect-error FIX: use a mapper from db
  if (req.user.user_type === "internal")
    // @ts-expect-error
    req.user.internal = true;

  // @ts-expect-error FIX: use a mapper from db
  delete req.user.user_type;

  return res.json(req.user)
});
userController.post("/logout", async (req, res) => {
  res.clearCookie("token");
  res.json({ ok: true });
});

userController.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ ok: false, message: "Missing required fields" });

  const user = await req.userRepository.findByEmailAndPassword(email, password);

  if (!user)
    return res.status(401).json({ ok: false, message: "Invalid credentials" });

  const session = new Session(user.id);
  await req.db("sessions").insert({ id: session.id, user_id: user.id });

  // @ts-expect-error FIX: use a mapper from db
  if (user.user_type === "internal")
    // @ts-expect-error
    user.internal = true;

  // @ts-expect-error FIX: use a mapper from db
  delete user.user_type;
  // @ts-expect-error FIX: use a mapper from db
  delete user.password_hash;

  res.cookie("token", session.id, { httpOnly: true, maxAge: 1000 * 60 * 60 * 12 });
  res.json(user);
});

userController.get("/internal/validate", authMiddleware("internal"), async (req, res) => {
  res.json({ ok: true });
});

userController.post("/external", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ ok: false, message: "Missing required fields" });

  try {
    const user = new UserBuilder({ name, email, passwordHash: password, userType: "external" }).build();
    await req.userRepository.save(user);

    res.setHeader("Location", `/users/${user.id}`);
    res.json({ ok: true });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "User already exists")
        return res.status(409).json({ ok: false, message: "User already exists with that email" });
    }

    res.status(500).json({ ok: false, message: "Internal server error" });
  }
});

const VALID_WORK_TYPE = ["formally", "unformally", "unemployed"];
const VALID_HOUSING_TYPE = ["own", "minha_casa_minha_vida", "rent", "given"];
const VALID_RELATION_TYPE = ["married", "stable_union", "affair", "ex"];

function validateCPF(cpf: string): string | false {
  return false;
}

function validatePhone(phone: string): boolean {
  const size = phone.length;

  if (size > 11 || size < 8)
    return false;

  if (!/^\d+$/.test(phone))
    return false;

  if (phone.length === 9 && phone[0] !== "9")
    return false;

  if (phone.length === 11 && phone[2] !== "9")
    return false;

  return true;
}

function extraDataMiddlewareDTO(request: Request, response: Response, next: NextFunction) {
  const { cpf, phone, housing, relation, work, trustedPhone } = request.body;

  const isValidWork = VALID_WORK_TYPE.some(w => w === work);
  if (!isValidWork)
    return response.status(400).json({ ok: false, message: "work" });

  const isValidHousing = VALID_HOUSING_TYPE.some(h => h === housing);
  if (!isValidHousing)
    return response.status(400).json({ ok: false, message: "housing" });

  const isValidRelation = VALID_RELATION_TYPE.some(r => r === relation);
  if (!isValidRelation)
    return response.status(400).json({ ok: false, key: "relation" });

  const ufOrFalsy = validateCPF(cpf);
  if (ufOrFalsy === false)
    return response.status(400).json({ ok: false, key: "cpf" });
  request.body.cpfUf = ufOrFalsy;

  const isValidPhone = validatePhone(phone);
  if (!isValidPhone)
    return response.status(400).json({ ok: false, key: "phone" });

  const isValidTrustedPhone = validatePhone(trustedPhone);
  if (!isValidTrustedPhone)
    return response.status(400).json({ ok: false, key: "trustedPhone" });

  next();
}

userController.get("/extra/check", meMiddleware, async (req, res) => {
  // TODO: remove me when mapper is done
  // @ts-expect-error FIX: use a mapper from db
  if (req.user.user_type === "internal") {
    return res.json({ show: false });
  }

  // TODO: return the user extra data here, with the `show` key
  return res.json({ show: true });
});

userController.post(
  "/external/extra",
  authMiddleware("external"),
  extraDataMiddlewareDTO,
  async (req, res) => {
    const {
      cpf,
      cpfUf,
      phone,
      housing,
      relation,
      work,
      trustedPhone,
      trustedName,
      adultChildren,
      kidChildren,
      address
    } = req.body;


    req.logger.child({
      cpf,
      cpfUf,
      phone,
      housing,
      relation,
      work,
      trustedPhone,
      trustedName,
      adultChildren,
      kidChildren,
      address
    }).info("received this data on extra data register")
    try {
      // TODO: change this? should return just ok: true ?
      res.json({ ok: true})
    } catch (err) {
      if (err instanceof Error) {
        req.logger.child({ error: err }).error(err.message)
      }

      res.status(500).json({ ok: false, message: "Internal server error" });
    }
  }
);

userController.post("/create", authMiddleware("internal"), async (req, res) => {
  const { name, email, password, userType } = req.body;

  if (userType !== "internal" && userType !== "external")
    return res.redirect(301, "/");

  if (!name || !email || !password || !userType)
    return res.status(400).json({ ok: false, message: "Missing required fields" });

  try {
    const user = new UserBuilder({ name, email, passwordHash: password, userType }).build();
    await req.userRepository.save(user);

    if (user.passwordHash)
      // @ts-expect-error let me delete it typescript
      delete user.passwordHash;

    res.json(user);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "Email conflict")
        return res.status(409).json({ ok: false, key: "email" });

      if (err.message === "Some conflict")
        return res.status(409).json({ ok: false, key: null });
    }

    return res.status(500).json({ ok: false, message: "Internal server error" });
  }
});

userController.get("/list", authMiddleware("internal"), async (req, res) => {
  const users = await req.userRepository.findAll();
  res.json(users);
});

export { userController };
