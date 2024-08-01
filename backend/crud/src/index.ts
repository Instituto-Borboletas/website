import express from "express";
import pino from "pino";

import database from "./infra/database";
import { internalAuthMiddleware } from "./middlewares/auth";

const PORT = process.env.PORT ?? 3000;

const logger = pino({});
const app = express();

app.use(express.json());

app.get("/healthcheck", internalAuthMiddleware, async (req, res) => {
  try {
    await database.raw("SELECT 1");
  } catch (err) {
    logger.error(err);
    res.json({ message: "server is good" });
    return
  }

  res.json({ message: "server is all good" });
});

app.listen(PORT, () => { logger.info(`Server running on port ${PORT}`) });
