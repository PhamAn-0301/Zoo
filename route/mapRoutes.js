import express from "express";
import * as animalModel from "../model/animalModel.js";

const router = express.Router();

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
      zoneLabel: hasZoneNumber
        ? `Khu ${zoneNumber}`
        : (a.zone ? String(a.zone) : null)
    };
  });

  res.render("map", {
    animals: JSON.stringify(normalizedAnimals)
  });

});

export default router;