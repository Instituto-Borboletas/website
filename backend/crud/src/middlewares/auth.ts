import type { Request, Response, NextFunction } from "express";

import { User, UserType } from "../domain/User";
const API_KEY = process.env.API_KEY;

export async function internalAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const key = req.headers["api-key"]

  if (key !== API_KEY)
    return res.status(401).json({ ok: false, message: "Unauthorized" });

  next();
}

export function authMiddleware(userType: UserType) {
  return async function(req: Request, res: Response, next: NextFunction) {
    let token = req.cookies?.token;

    if (req.remoteAddress?.includes("127.0.0.1"))
      token = req.headers?.token ?? req.cookies?.token;

    if (!token)
      return res.status(401).json({ ok: false, message: "Unauthorized" });

    const userDb = await req.db("sessions")
      .select("users.*")
      .join("users", "sessions.user_id", "users.id")
      .where("sessions.id", token)
      .where("users.user_type", userType)
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

    next();
  }
}
