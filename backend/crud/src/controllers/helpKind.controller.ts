import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { HelpKindBuilder } from "../domain/builders/HelpKind";

const helpKindController = Router();

helpKindController.post("/", authMiddleware("internal"), async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description)
    return res.status(400).json({ ok: false, message: "Missing required fields" });

  const helpKind = new HelpKindBuilder({
    name,
    description,
    createdBy: req.user!.id
  }).build()

  try {
    await req.helpKindRepository.save(helpKind);

    return res.status(201).json(helpKind);
  } catch (error) {
    req.logger.child({ error }).error("Error saving help kind");
    return res.status(500).json({ ok: false, message: "Internal server error" });
  }
});

helpKindController.get("/", authMiddleware("internal"), async (req, res) => {
  try {
    const helpKinds = await req.helpKindRepository.findAll();
    return res.json(helpKinds);
  } catch (error) {
    req.logger.child({ error }).error("Error fetching help kinds");
    return res.status(500).json({ ok: false, message: "Internal server error" });
  }
});

helpKindController.get("/options", authMiddleware("external"), async (req, res) => {
  try {
    const helpKinds = await req.helpKindRepository.listAsOptions()
    return res.json(helpKinds);
  } catch (error) {
    req.logger.child({ error }).error("Error fetching help kinds");
    return res.status(500).json({ ok: false, message: "Internal server error" });
  }
});

export { helpKindController };
