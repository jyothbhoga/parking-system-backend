"use strict";
import express from "express";
import vehicleRoutes from "./vehicles.js";
import adminRoutes from "./admins.js";
import constants from "../config/constants.js";

const router = express.Router();

router.use(`${constants.BASE_URL}/${constants.VEHICLE_URL}`, vehicleRoutes);
router.use(`${constants.BASE_URL}/${constants.ADIMN_URL}`, adminRoutes);

export default router;
