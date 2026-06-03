import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import forecastController from "../controller/forecastController.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  forecastController.getForecast
);

export default router;