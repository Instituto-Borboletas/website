import { Request, Response, NextFunction, Router } from "express";

import { UserBuilder } from "../domain/builders/UserBuilder";
import { Session } from "../domain/Session";
import { authMiddleware } from "../middlewares/auth";
import { clearString } from "../utils";
import { User } from "../domain/User";
import { validateCPF, validatePhone } from "./validators/users/extraData";
import { ExtraDataBuilder } from "../domain/builders/ExtraDataBuilder";

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

const VALID_WORK_TYPE = ["formal", "unformal", "unemployed"];
const VALID_HOUSING_TYPE = ["own", "minha_casa_minha_vida", "rent", "given"];
const VALID_RELATION_TYPE = ["married", "stable_union", "affair", "ex", "not_apply"];

function extraDataMiddlewareDTO(request: Request, response: Response, next: NextFunction) {
  let { cpf, phone, trustedPhone } = request.body;
  const { birthDate, housing, relation, work, } = request.body;

  phone = clearString(phone ?? "");
  cpf = clearString(cpf ?? "");
  trustedPhone = clearString(trustedPhone ?? "");

  const isValidBirthDate = Number.isNaN(Date.parse(birthDate))
  if (!isValidBirthDate)
    return response.status(400).json({ ok: false, key: "birthDate" });

  const isValidWork = VALID_WORK_TYPE.some(w => w === work);
  if (!isValidWork)
    return response.status(400).json({ ok: false, key: "work" });

  const isValidHousing = VALID_HOUSING_TYPE.some(h => h === housing);
  if (!isValidHousing)
    return response.status(400).json({ ok: false, key: "housing" });

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
      return res.status(412).json({ ok: false, message: "Ainda nao estamos prontos para receber essa chamada de api" });
      // res.json({ ok: true})
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
