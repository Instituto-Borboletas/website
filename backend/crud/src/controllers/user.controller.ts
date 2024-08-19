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

userController.post("/internal", authMiddleware("internal"), async (req, res) => {
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

userController.get("/list", authMiddleware("internal"), async (req, res) => {
  const users = await req.userRepository.findAll();
  res.json(users);
});

export { userController };
