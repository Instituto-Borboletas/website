import { Request } from "express";
import type knex from "knex";
import pino from "pino";

import { User } from "../../src/domain/User";
import { UserRespository } from "../../src/repositories/user/interface";
import { VolunteerKindRepository } from "../../src/repositories/volunteerKind/interface";
import { VolunteerRepository } from "../../src/repositories/volunteer/interface";
import { HelpRequestRepository } from "../../src/repositories/help/interface";
import { HelpKindRepository } from "../../src/repositories/helpKind/interface";

declare global {
  namespace Express {
    interface Request {
      remoteAddress?: string,
      sessionToken?: string,
      user?: User,
      userRepository: UserRespository,
      volunteerRepository: VolunteerRepository,
      volunteerKindRepository: VolunteerKindRepository,
      helpRequestRepository: HelpRequestRepository,
      helpKindRepository: HelpKindRepository,
      db: knex.Knex,
      logger: pino.Logger,
    }
  }
}
