import { Router } from "express";

import { authMiddleware } from "../middlewares/auth";
import { volunteerKindController } from "./volunteerKind.controller";
import { VolunteerBuilder } from "../domain/builders/VolunteerBuilder";

const volunteerController = Router();
volunteerController.use("/kinds", volunteerKindController);

volunteerController.get("/", authMiddleware("internal"), async (req, res) => {
  try {
    const volunteers = await req.volunteerRepository.findAll();
    return res.json(volunteers);
  } catch (error) {
    req.logger.child({ error }).error("Error fetching volunteers");
    return res.status(500).json({ ok: false, message: "Internal server error" });
  }
});

volunteerController.post("/", authMiddleware("external"), async (req, res) => {
  const { name, email, phone, kind: kindId } = req.body;

  if (!name || !phone || !kindId)
    return res.status(400).json({ ok: false, message: "Missing required fields" });

  const volunterKind = await req.volunteerKindRepository.findById(kindId);

  if (!volunterKind)
    return res.status(412).json({ ok: false, message: "Volunteer kind not found" });

  const volunteer = new VolunteerBuilder({
    name,
    email,
    phone,
    volunteerKindId: kindId,
    createdBy: req.user!.id
  }).build();

  try {
    await req.volunteerRepository.save(volunteer);
    return res.status(201).json(volunteer);
  } catch (error) {
    req.logger.child({ error }).error("Error saving volunteer");
    return res.status(500).json({ ok: false, message: "Internal server error" });
  }
});

volunteerController.get("/:id", authMiddleware("internal"), async (req, res) => {
  return res.json({ ok: true, volunteer: req.params.id });
});

volunteerController.get("/", authMiddleware("internal"), async (req, res) => {
  try {
    const volunteers = await req.volunteerRepository.findAll();
    return res.json(volunteers);
  } catch (error) {
    req.logger.child({ error }).error("Error fetching volunteers");
    return res.status(500).json({ ok: false, message: "Internal server error" });
  }
});

export { volunteerController };
