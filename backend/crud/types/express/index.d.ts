import { Request } from "express";
import { User } from "../../src/domain/User";
import type knex from "knex";
import { UserRespository } from "../../src/repositories/user/interface";

declare global {
  namespace Express {
    interface Request {
      remoteAddress?: string,
      user?: User,
      userRepository: UserRespository,
      db: knex.Knex
    }
  }
}
