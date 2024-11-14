import { Router } from "express";

import { authMiddleware } from "../middlewares/auth";
import { VolunteerKindBuilder } from "../domain/builders/VolunteerKindBuilder";

const volunteerKindController = Router();

volunteerKindController.post("/", authMiddleware("internal"), async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description)
    return res.status(400).json({ ok: false, message: "Missing required fields" });

  try {
    const volunteerKind = new VolunteerKindBuilder({
      name,
      description,
      createdBy: req.user!.id
    }).build()

    await req.volunteerKindRepository.save(volunteerKind);

    res.json(volunteerKind);
  } catch (err) {
    req.logger.error(err);
    res.status(500).json({ ok: false, message: "Internal server error" });
  }
});

volunteerKindController.get("/", authMiddleware("internal"), async (req, res) => {
  const volunteerKinds = await req.db("volunteers_kind")
    .join("users", "volunteers_kind.created_by", "users.id")
    .select("volunteers_kind.*", "users.name as created_by_name", "users.email as created_by")
    .orderBy("volunteers_kind.created_at", "desc")
    .select();

  res.json(volunteerKinds);
});

volunteerKindController.patch("/:id/toggle", authMiddleware("internal"), async (req, res) => {
  const { id } = req.params;

  const volunteerKind = await req.volunteerKindRepository.findById(id);

  if (!volunteerKind)
    return res.status(404).json({ ok: false, message: "VolunteerKind not found" });

  const updatedVolunteerKind = new VolunteerKindBuilder({ ...volunteerKind, })
    .setUpdatedAt(Date.now())
    .setIsEnabled(!volunteerKind.enabled)
    .build();


  try {
    await req.volunteerKindRepository.updateEnabled(updatedVolunteerKind);

    res.json({ ok: true });
  } catch (err) {
    req.logger.error(err);
    res.status(500).json({ ok: false, message: "Internal server error" });
  }
});

volunteerKindController.get("/options", authMiddleware("external"), async (req, res) => {
  const volunteerKinds = await req.volunteerKindRepository.listAsOptions();

  res.json(volunteerKinds);
});

export { volunteerKindController };
