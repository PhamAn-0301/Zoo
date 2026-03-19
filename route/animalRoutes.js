import express from "express";
import * as animalModel from "../model/animalModel.js";

const router = express.Router();

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
      updatedAt: new Date().toISOString(),

      animals,
      hasAnimals: animals.length > 0,

      errorMessage: null
    });

  } catch (error) {
    next(error);
  }
});

export default router;