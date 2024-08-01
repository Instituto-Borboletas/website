import type { Request, Response, NextFunction } from "express";

const API_KEY = process.env.API_KEY;

export async function internalAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const key = req.headers["api-key"]

  if (key !== API_KEY)
    return res.status(401).json({ ok: false, message: "Unauthorized" });

  next();
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }

  const user = null

  if (!user) {
    return res.sendStatus(401);
  }

  // req.user = user;
  next();
}
