import { UserBuilder } from "../domain/builders/UserBuilder";
import { Session } from "../domain/Session";
import { authMiddleware } from "../middlewares/auth";
import { Router } from "express";

const userController = Router();

userController.post("/internal", authMiddleware("internal"), (req, res) => {
});

userController.post("/internal/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ ok: false, message: "Missing required fields" });

  const user = await req.userRepository.findByEmailAndPassword(email, password);

  if (!user)
    return res.status(401).json({ ok: false, message: "Invalid credentials" });

  // TODO: change to use session builder and session repository
  const session = new Session(user.id);
  await req.db("sessions").insert({ id: session.id, user_id: user.id });
  // TODO

  res.cookie("token", session.id, { httpOnly: true, maxAge: 1000 * 60 * 60 * 12 });
  res.json({ ok: true });
});

userController.get("/internal/validate", authMiddleware("internal"), async (req, res) => {
  res.json({ ok: true });
});

userController.post("/external", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ ok: false, message: "Missing required fields" });

  const user = new UserBuilder({ name, email, passwordHash: password, userType: "external" }).build();
  await req.userRepository.save(user);

  res.setHeader("Location", `/users/${user.id}`);
  res.json({ ok: true });
});

export { userController };
