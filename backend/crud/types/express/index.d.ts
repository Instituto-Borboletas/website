import { Request } from "express";
import type knex from "knex";
import pino from "pino";

import { User } from "../../src/domain/User";
import { UserRespository } from "../../src/repositories/user/interface";
import { VolunteerKindRepository } from "../../src/repositories/volunteerKind/interface";

declare global {
  namespace Express {
    interface Request {
      remoteAddress?: string,
      user?: User,
      userRepository: UserRespository,
      volunteerKindRepository: VolunteerKindRepository,
      db: knex.Knex,
      logger: pino.Logger,
    }
  }
}
