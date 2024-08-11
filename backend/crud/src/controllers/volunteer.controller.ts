import { Router } from "express";

import { authMiddleware } from "../middlewares/auth";
import { volunteerKindController } from "./volunteerKind.controller";

const volunteerController = Router();
volunteerController.use("/kinds", volunteerKindController);

volunteerController.get("/", authMiddleware("internal"), async (req, res) => {
});

export { volunteerController };
