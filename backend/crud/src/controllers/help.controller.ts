import { Router } from "express";
import { helpKindController } from "./helpKind.controller";
import { authMiddleware } from "../middlewares/auth";
import { VolunteerBuilder } from "../domain/builders/VolunteerBuilder";

const helpController = Router();
helpController.use("/kinds", helpKindController);

helpController.post("/", authMiddleware("external"), async (req, res) => {
  const { name, email, phone, kindId } = req.body;

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

helpController.get("/", authMiddleware("internal"), async (req, res) => {
  try {
    const helps = await req.helpRequestRepository.findAll();
    return res.json(helps);
  } catch (error) {
    req.logger.child({ error }).error("Error fetching volunteers");
    return res.status(500).json({ ok: false, message: "Internal server error" });
  }
});

export { helpController };
