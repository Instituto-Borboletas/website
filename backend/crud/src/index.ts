import express from "express";
import pino from "pino";

import database from "./infra/database";
import { hashPassword } from "./utils";
import { internalAuthMiddleware } from "./middlewares/auth";

import { userController } from "./controllers/user.controller";

import { PostgresUserRepository } from "./repositories/user/postgres";
import { PostgresVolunteerKindRespository } from "./repositories/volunteerKind/postgres";

const PORT = process.env.PORT ?? 3000;

const logger = pino({});
const app = express();

const postgresUserRepository = new PostgresUserRepository(database, logger);
const postgresVolunteerKindRespository = new PostgresVolunteerKindRespository(database, logger);

app.use(express.json());

// setuping respositories on req object
app.use((req, res, next) => {
  req.userRepository = postgresUserRepository;
  req.volunteerKindRepository = postgresVolunteerKindRespository;
  req.db = database;
  req.logger = logger;

  if (req.body.password)
    req.body.password = hashPassword(req.body.password);

  next();
});

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

app.listen(PORT, () => { logger.info(`Server running on port ${PORT}`) });
