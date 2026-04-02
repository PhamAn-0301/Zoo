import express from "express";
import * as animalModel from "../model/animalModel.js";

const router = express.Router();

function parseCheckinStatus(value) {
  if (value === true || value === 1) return true;
  if (value === false || value === 0) return false;

  const normalized = String(value ?? "").trim().toLowerCase();
  if (["1", "true", "checked", "checked-in", "done"].includes(normalized)) return true;
  if (["0", "false", "unchecked", "pending"].includes(normalized)) return false;

  return null;
}

router.get("/map", async (req, res) => {

  const animals = await animalModel.findAll();

  const normalizedAnimals = animals.map((a) => {
    const zoneNumber = Number(a.zone);
    const hasZoneNumber = Number.isFinite(zoneNumber);

    const mapX = Number(a.mapX ?? a.map_x);
    const mapY = Number(a.mapY ?? a.map_y);

    return {
      id: a.id,
      name: a.name,
      species: a.family || a.species,
      zone: hasZoneNumber ? zoneNumber : a.zone ?? null,
      map_x: Number.isFinite(mapX) ? mapX : null,
      map_y: Number.isFinite(mapY) ? mapY : null,
      image_url: a.imageUrl || a.image_url || null,
      conservation_status: a.conservationStatus || a.conservation_status || null,
      feeding_time: a.feedingTime || a.feeding_time || null,
      active_time: a.activeTime || a.active_time || null,
      status: a.status,
      checkin_status: Boolean(a.checkinStatus ?? a.checkin_status),
      zoneLabel: hasZoneNumber
        ? `Khu ${zoneNumber}`
        : (a.zone ? String(a.zone) : null)
    };
  });

  res.render("map", {
    animals: JSON.stringify(normalizedAnimals)
  });

});

router.patch("/api/map/animals/:id/checkin", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "ID động vật không hợp lệ." });
    }

    const desiredStatus = parseCheckinStatus(req.body?.checkin_status);
    const nextStatus = desiredStatus === null ? true : desiredStatus;

    const updated = await animalModel.updateCheckinStatusById(id, nextStatus);
    if (!updated) {
      return res.status(404).json({ message: "Không tìm thấy động vật." });
    }

    return res.json({
      animal: {
        id: updated.id,
        checkin_status: Boolean(updated.checkinStatus ?? updated.checkin_status),
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;