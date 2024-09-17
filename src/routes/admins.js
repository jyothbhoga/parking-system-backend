import express from "express";
import bcrypt from "bcryptjs";
import Admin from "./../models/admin.js";
import adminController from "../controllers/adminController.js";

const router = express.Router();

router.post("/login", adminController.loginAdmin);

router.post("/create", adminController.createAdmin);

export default router;
