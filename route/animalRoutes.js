import express from "express";
import * as animalModel from "../model/animalModel.js";

const router = express.Router();

function getRandomAnimals(list, limit) {
  const cloned = [...list];

  for (let i = cloned.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
  }

  return cloned.slice(0, limit);
}

router.get("/api/animals", async (req, res, next) => {
  try {
    const animals = await animalModel.findAll();
    res.json({ animals });
  } catch (error) {
    next(error);
  }
});

router.get("/api/animals/random", async (req, res, next) => {
  try {
    const limit = Number.parseInt(req.query.limit, 10) || 8;
    const animals = await animalModel.findAll();
    const randomAnimals = getRandomAnimals(animals, Math.min(limit, animals.length));

    res.json({ animals: randomAnimals });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /animals
 * Có thể filter theo ?zone=1
 */
router.get("/animals", async (req, res, next) => {
  try {
    const { zone } = req.query;

    let animals;

    if (zone) {
      animals = await animalModel.findByZone(zone);
    } else {
      animals = await animalModel.findAll();
    }

    res.render("animal", {
      title: "Animals",
      subtitle: "Danh sách động vật",
      updatedAt: new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }).format(new Date()),

      animals,
      hasAnimals: animals.length > 0,

      errorMessage: null
    });

  } catch (error) {
    next(error);
  }
});

export default router;