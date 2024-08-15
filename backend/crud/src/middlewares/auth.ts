import type { Request, Response, NextFunction } from "express";

import { UserType } from "../domain/User";
const API_KEY = process.env.API_KEY;

export async function internalAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const key = req.headers["api-key"]

  if (key !== API_KEY)
    return res.status(401).json({ ok: false, message: "Unauthorized" });

  next();
}

export function authMiddleware(userType: UserType) {
  return async function(req: Request, res: Response, next: NextFunction) {
    const token = req.remoteAddress?.includes("127.0.0.1")
      ? (req.headers?.token ?? req.cookies?.token)
      : req.cookies?.token;

    if (!token)
      return res.status(401).json({ ok: false, message: "Unauthorized" });

    const user = await req.db("sessions")
      .select("users.*")
      .join("users", "sessions.user_id", "users.id")
      .where("sessions.id", token)
      .where("users.user_type", userType)
      .first();

    if (!user)
      return res.sendStatus(401);

    req.user = user;

    next();
  }
}
