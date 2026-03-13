import express from "express";
import * as mapModel from "../model/mapModel.js";

const router = express.Router();

router.get("/map", async (req, res) => {

  const animals = await mapModel.getAnimals();

  res.render("map", {
    animals: JSON.stringify(animals)
  });

});

export default router;