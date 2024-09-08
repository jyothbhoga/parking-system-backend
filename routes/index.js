"use strict";
import express from "express";
import vehicleRoutes from "./vehicles.js";
import adminRoutes from "./admins.js";

const router = express.Router();

router.use("/vehicles", vehicleRoutes);
router.use("/admin", adminRoutes);

export default router;
