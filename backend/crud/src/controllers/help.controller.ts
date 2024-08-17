import { Router } from "express";
import { helpKindController } from "./helpKind.controller";
import { authMiddleware } from "../middlewares/auth";
import { HelpRequestBuilder } from "../domain/builders/HelpRequestBuilder";

const helpController = Router();
helpController.use("/kinds", helpKindController);

helpController.post("/", authMiddleware("external"), async (req, res) => {
  const { description, kind: kindId } = req.body;

  if (!description || !kindId)
    return res.status(400).json({ ok: false, message: "Missing required fields" });

  const kind = await req.helpKindRepository.findById(kindId);
  if (!kind)
  return res.status(412).json({ ok: false, message: "Help kind not found" });

  const helpRequest = new HelpRequestBuilder({
    description,
    kindId,
    createdBy: req.user!.id
  }).build();

  try {
    await req.helpRequestRepository.save(helpRequest);
    return res.status(201).json(helpRequest);
  } catch (error) {
    req.logger.child({ error }).error("Error saving help request");
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
