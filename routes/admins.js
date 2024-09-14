import express from "express";
import bcrypt from "bcryptjs";
import Admin from "./../models/admin.js";
import generateToken from "../auth/generateToken.js";
import authMiddleware from "../auth/authMiddleware.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Check if both email and password are provided
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    // Find the admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Generate a JWT token
    const token = generateToken(admin);

    // Send token to client
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/create", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if the email is provided
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // Check if the admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new admin Admin
    const newAdmin = new Admin({
      email,
      password: hashedPassword,
      name,
    });

    await newAdmin.save();

    res
      .status(201)
      .json({ message: "Admin created successfully.", admin: newAdmin });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
