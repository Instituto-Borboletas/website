import { Router } from "express";

import { authMiddleware } from "../middlewares/auth";

const volunteerController = Router();

volunteerController.get("/", authMiddleware("internal"), async (req, res) => {
});

export default volunteerController;
