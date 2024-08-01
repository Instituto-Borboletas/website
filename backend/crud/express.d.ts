import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      user: User;
      db: import("knex");
    }
  }
}
