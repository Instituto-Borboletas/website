import { UserBuilder } from "../domain/builders/UserBuilder";
import { Session } from "../domain/Session";
import { UserType } from "../domain/User";
import { authMiddleware } from "../middlewares/auth";
import { Request, Response, NextFunction, Router } from "express";

const userController = Router();

function loginMiddleware(req: Request, res: Response, next: NextFunction) {
  const userType = req.params.userType;

  if (userType !== "internal" && userType !== "external")
    return res.redirect("/");

  next();
}

userController.post("/:userType/login", loginMiddleware, async (req, res) => {
  const userType = req.params.userType as UserType;

  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ ok: false, message: "Missing required fields" });

  const user = await req.userRepository.findByEmailAndPassword(email, password, userType);

  if (!user)
    return res.status(401).json({ ok: false, message: "Invalid credentials" });

  const session = new Session(user.id);
  await req.db("sessions").insert({ id: session.id, user_id: user.id });

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

export { userController };
