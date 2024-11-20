import express, { NextFunction, Request, Response } from "express";
import pino from "pino";
import cors from "cors";

import cookieParser from "cookie-parser";

import database from "./infra/database";
import { hashPassword } from "./utils";
import { internalAuthMiddleware } from "./middlewares/auth";

import { userController } from "./controllers/user.controller";
import { volunteerController } from "./controllers/volunteer.controller";
import { helpController } from "./controllers/help.controller";

import { PostgresUserRepository } from "./repositories/user/postgres";
import { PostgresVolunteerRespository } from "./repositories/volunteer/postgres";
import { PostgresVolunteerKindRespository } from "./repositories/volunteerKind/postgres";
import { PostgresHelpRepository } from "./repositories/help/postgres";
import { PostgresHelpKindRepository } from "./repositories/helpKind/postgres";
import { PostgresAddressRepository } from "./repositories/address/postgres";
import { PostgresExtraDataRepository } from "./repositories/user/extraData/postgres";

const PORT = process.env.PORT ?? 3000;

const logger = pino({ });
const app = express();

const postgresUserRepository = new PostgresUserRepository(database, logger);
const postgresVolunteerRespository = new PostgresVolunteerRespository(database, logger);
const postgresVolunteerKindRespository = new PostgresVolunteerKindRespository(database, logger);
const postgresHelpRequestRepository = new PostgresHelpRepository(database, logger);
const postgresHelpKindRepository = new PostgresHelpKindRepository(database, logger);
const postgresAddressRepository = new PostgresAddressRepository(database, logger);
const postgressExtraDataRepository = new PostgresExtraDataRepository(database, logger);

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173", "https://institutoborboletas.com", "https://institutoborboleta.com"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

// setuping respositories on req object
app.use((req, _, next) => {
  req.userRepository = postgresUserRepository;

  req.volunteerRepository = postgresVolunteerRespository;
  req.volunteerKindRepository = postgresVolunteerKindRespository;

  req.helpRequestRepository = postgresHelpRequestRepository;
  req.helpKindRepository = postgresHelpKindRepository;

  req.addressRepository = postgresAddressRepository;
  req.extraDataRepository = postgressExtraDataRepository;

  req.db = database;
  req.logger = logger;

  if (req.body.password)
    req.body.password = hashPassword(req.body.password);

  next();
});

function remoteAddressMiddleware(req: Request, res: Response, next: NextFunction) {
  const remoteAddress = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  req.remoteAddress = remoteAddress as string;
  req.sessionToken = req.cookies?.token;

  next();
}

app.use(remoteAddressMiddleware);

function logginMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  const originalEnd = res.end;

  // @ts-expect-error - monkey patching res end method
  res.end = function (...args) {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;

    logger.info({
      method: req.method,
      url: req.originalUrl,
      remoteAddress: req.remoteAddress,
      body: req.body,
      statusCode,
      duration,
    });

    // @ts-expect-error - monkey patching res end method
    originalEnd.apply(res, args);
  };

  next();
}

app.use(logginMiddleware);

app.get("/healthcheck", internalAuthMiddleware, async (req, res) => {
  try {
    await req.db.raw("SELECT 1");
  } catch (err) {
    logger.error(err);
    res.json({ message: "server is good" });
    return
  }

  res.json({ message: "server is all good" });
});

app.use("/users", userController);
app.use("/volunteers", volunteerController);
app.use("/helps", helpController)

app.listen(PORT, () => { logger.info(`Server running on port ${PORT}`) });
