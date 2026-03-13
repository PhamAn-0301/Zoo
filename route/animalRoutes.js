import express from "express";
import * as animalModel from "../model/animalModel.js";

const router = express.Router();

router.get("/animal", async (req, res, next) => {
  try {
    const animals = await animalModel.findAll();

    res.render("animal", {
      title: "Animals",
      subtitle: "Danh sach dong vat",
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