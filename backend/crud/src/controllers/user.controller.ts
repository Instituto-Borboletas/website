import { Request, Response, NextFunction, Router } from "express";

import { UserBuilder } from "../domain/builders/UserBuilder";
import { Session } from "../domain/Session";
import { authMiddleware } from "../middlewares/auth";
import { clearString } from "../utils";
import { User } from "../domain/User";
import { validateCPF, validatePhone } from "./validators/users/extraData";
import { ExtraDataBuilder } from "../domain/builders/ExtraDataBuilder";
import { AddressBuilder } from "../domain/builders/AddressBuilder";

const userController = Router();

async function meMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.remoteAddress?.includes("127.0.0.1") || req.remoteAddress?.includes("::1")
    ? (req.headers?.token ?? req.cookies?.token)
    : req.cookies?.token;

  if (!token)
    return res.status(401).json({ ok: false, message: "Unauthorized" });

  const userDb = await req.db("sessions")
    .select("users.user_type")
    .join("users", "sessions.user_id", "users.id")
    .where("sessions.id", token)
    .first();

  if (!userDb)
    return res.sendStatus(401);

  const user = new User({
    id: userDb.id,
    userType: userDb.user_type,
    email: userDb.email,
    name: userDb.name,
  })

  req.user = user;
  req.params.userType = user.userType;

  // WARNING: this causes two times db call for session validation.
  return authMiddleware(user.userType)(req, res, next);
}

userController.get("/me", meMiddleware, async (req, res) => {
  delete req.user?.passwordHash;

  if (req.user?.userType === "internal")
    // @ts-expect-error TODO: change frontend check for a permission ms? IDK
    req.user.internal = true;

  // @ts-expect-error NOTE: we dont want userType to be sent to frontend
  delete req.user.userType;

  const extraData = await req.extraDataRepository.get(req.user!.id)

  const { extra, address } = extraData ?? { extra: {}, address: {} };

  const helpsPromise = req.db("helps").where("helps.created_by", req.user!.id)
    .join("helps_kind", "helps_kind.id", "helps.help_kind_id")
    .select("helps.description", "helps_kind.name as help_kind_name")

  const volunteersPromise = req.db("volunteers").where("volunteers.created_by", req.user!.id)
    .join("volunteers_kind", "volunteers_kind.id", "volunteers.kind_id")
    .select("volunteers.name", "volunteers_kind.name as help_kind_name")

  const [helps, volunteers] = await Promise.all([helpsPromise, volunteersPromise])

  return res.json({ ...req.user, extra: { ...extra, address }, helps, volunteers })
});

userController.post("/logout", async (_, res) => {
  res.clearCookie("token");
  res.json({ ok: true });
});

userController.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ ok: false, message: "Missing required fields" });

    const user = await req.userRepository.findByEmailAndPassword(email, password);

    if (!user)
      return res.status(401).json({ ok: false, message: "Invalid credentials" });

    const session = new Session(user.id);
    await req.db("sessions").insert({ id: session.id, user_id: user.id });

    if (user.userType === "internal")
      // @ts-expect-error TODO: change frontend check for a permission ms? IDK
      user.internal = true;

    // @ts-expect-error TODO: change frontend check for a permission ms? IDK
    delete user.userType;
    delete user.passwordHash;

    res.cookie("token", session.id, { httpOnly: true, maxAge: 1000 * 60 * 60 * 12 });

    return res.json(user);
  } catch (error) {
    req.logger.child({ error }).error("Error on user login")
    res.status(500).json({ ok: false, message: "Internal server error" })
  }
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

  request.body.phone = phone = clearString(phone ?? "");
  request.body.cpf = cpf = clearString(cpf ?? "");
  request.body.trustedPhone = trustedPhone = clearString(trustedPhone ?? "");
  request.body.address.zip = clearString(request.body.address.zip);

  const isValidBirthDate = !Number.isNaN(Date.parse(birthDate))
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
  if (trustedPhone && !isValidTrustedPhone)
    return response.status(400).json({ ok: false, key: "trustedPhone" });

  next();
}

userController.put(
  "/external/extra",
  authMiddleware("external"),
  extraDataMiddlewareDTO,
  async (req, res) => {
    const {
      cpf,
      cpfUf,
      birthDate,
      phone,
      housing,
      relation,
      work,
      trustedPhone,
      trustedName,
      adultChildren,
      kidChildren,
      address,
      income
    } = req.body;

    try {
      const addressRegister = new AddressBuilder(address)
        .setCreatedBy(req.user!.id)
        .build()

      try {
        // FIX: something is wrong here, not working
        await req.addressRepository.save(addressRegister);
      } catch (error) {
        const err = error as object;
        req.logger
          .child({ error, info: 'Error on store address on extra data request' })
          .error("message" in err ? err.message : 'Fail')

        return res.status(412).json({ ok: false, key: "address", fail: true });
      }

      const extraData = new ExtraDataBuilder({
        cpf: cpf as string,
        cpfUf,
        birthDate,
        phone,
        housing,
        relation,
        work,
        trustedPhone,
        trustedName,
        adultChildren,
        kidChildren,
        income,
        addressId: addressRegister.id,
        userId: req.user!.id,
      }).build()

      try {
        await req.extraDataRepository.save(extraData)
      } catch (error) {
        const err = error as object;
        req.logger
          .child({ error, info: 'Error on store extra data' })
          .error("message" in err ? err.message : 'Fail')

        return res.status(412).json({ ok: false, key: "extraData", fail: true });
      }

      return res.json({ ok: true })
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
