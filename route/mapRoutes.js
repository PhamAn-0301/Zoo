import express from "express";
import * as mapModel from "../model/mapModel.js";

const router = express.Router();

router.get("/map", async (req, res, next) => {
  try {
    const pageData = await mapModel.getMapPageData();

    res.render("map", {
      ...pageData
    });

  } catch (error) {
    next(error);
  }
});

export default router;