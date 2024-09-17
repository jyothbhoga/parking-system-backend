"use strict";
import express from "express";
import Vehicle from "../models/vehicle.js";

const router = express.Router();

import multer from "multer";
import authMiddleware from "../auth/authMiddleware.js";
import vehicleController from "../controllers/vehicleController.js";
import { upload } from "../helpers/upload.js";

// Get all vehicles
router.get("/", authMiddleware, vehicleController.getVehicles);

// Get vehicle by ID
router.get("/:id", authMiddleware, vehicleController.getVehicleById);

router.post("/create", upload, authMiddleware, vehicleController.createVehicle);

router.post(
  "/update/:id",
  upload,
  authMiddleware,
  vehicleController.updateVehicle
);

router.post("/delete/:id", authMiddleware, vehicleController.deleteVehicle);

export default router;
