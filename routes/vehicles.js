import dotenv from "dotenv";
import path from "path";

const envFile =
  process.env.NODE_ENV === "production" ? ".env.prod" : ".env.dev";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

import express from "express";
import Vehicle from "../models/vehicle.js";

import admin from "firebase-admin";

const router = express.Router();

import serviceAccount from "../vehicle-private-key.json" assert { type: "json" };
import multer from "multer";
import { Storage } from "@google-cloud/storage";
import authMiddleware from "../auth/authMiddleware.js";

const storage = new Storage({
  projectId: process.env.PROJECT_ID,
  keyFilename: "./vehicle-private-key.json",
});

// Initialize Firebase Admin and Storage Bucket
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.STORAGE_BUCKET,
});

const bucket = admin.storage().bucket();

// Multer setup to handle image upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10000000 }, // 10MB file size limit
}).single("stickerImgURL");

// Get all vehicles
router.get("/", authMiddleware, async (req, res) => {
  try {
    // Get page and limit from query params, or set default values
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page

    // Calculate the starting index for pagination
    const startIndex = (page - 1) * limit;

    // Get the total number of vehicles for pagination purposes
    const totalVehicles = await Vehicle.countDocuments();

    // Find the vehicles with pagination
    const vehicles = await Vehicle.find()
      .sort({ createdAt: -1 }) // Sort by 'createdAt' in descending order
      .skip(startIndex)
      .limit(limit);

    // Calculate total pages
    const totalPages = Math.ceil(totalVehicles / limit);

    // Return the paginated result along with additional metadata
    res.status(200).json({
      total: totalVehicles, // Total number of vehicles in the database
      page,
      totalPages,
      count: vehicles.length, // Number of vehicles in the current page
      vehicles,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving vehicles", error: err.message });
  }
});

// Get vehicle by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" }); // 404 status code if no vehicle is found
    }

    res.status(200).json(vehicle); // Return the vehicle with a 200 status code
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving vehicle", error: err.message }); // 500 status code for server error
  }
});

// Create a new Vehicle with an image upload
router.post("/create", upload, authMiddleware, async (req, res) => {
  try {
    const { name, ownerName, regNo, type, roomNo, bldgName } =
      req.body;
    const file = req.file;

    let stickerImgURL = "";

    // Check if an image file is provided
    if (file) {
      // Generate unique file name
      const fileName = regNo
        .toString()
        .toLowerCase()
        .replace(/\s+/g, "_");

      // Upload the file to Firebase Storage
      const fileUpload = bucket.file(fileName);
      const blobStream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });

      await new Promise((resolve, reject) => {
        blobStream.on("error", (error) => {
          reject(error);
        });

        blobStream.on("finish", async () => {
          await storage.bucket(bucket.name).file(fileName).makePublic();
          stickerImgURL = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
          resolve();
        });

        blobStream.end(file.buffer);
      });
    }

    // Create a new vehicle document in MongoDB
    const vehicle = await Vehicle.create({
      name,
      ownerName,
      regNo,
      type,
      roomNo,
      bldgName,
      stickerImgURL, // Add the image URL to the vehicle data
    });

    // Return the created vehicle with a 201 status code for created
    res.status(201).json(vehicle);
  } catch (err) {
    // Send a 400 status code for client errors and include error message
    res
      .status(400)
      .json({ message: "Error creating vehicle", error: err.message });
  }
});

router.post("/update/:id", upload, authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, ownerName, regNo, type, roomNo, bldgName } =
      req.body;
    const file = req.file;
    const vehicle = await Vehicle.findById(id);
    if (
      regNo &&
      regNo === vehicle.regNo
    ) {
      let stickerImgURL = "";

      // Find the vehicle by ID
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }

      // Check if an image file is provided
      if (file) {
        // Generate unique file name
        const fileName = regNo
          .toString()
          .toLowerCase()
          .replace(/\s+/g, "_");

        // Upload the file to Firebase Storage
        const fileUpload = bucket.file(fileName);
        const blobStream = fileUpload.createWriteStream({
          metadata: {
            contentType: file.mimetype,
          },
        });

        await new Promise((resolve, reject) => {
          blobStream.on("error", (error) => {
            reject(error);
          });

          blobStream.on("finish", async () => {
            await storage.bucket(bucket.name).file(fileName).makePublic();
            stickerImgURL = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
            resolve();
          });

          blobStream.end(file.buffer);
        });
      } else {
        // If no new image is uploaded, keep the old image URL
        stickerImgURL = vehicle.stickerImgURL;
      }

      // Update the vehicle document in MongoDB
      const updatedVehicle = await Vehicle.findByIdAndUpdate(
        id,
        {
          name,
          ownerName,
          regNo,
          type,
          roomNo,
          bldgName,
          stickerImgURL, // Update the image URL if a new image was uploaded
          updatedAt: new Date(),
        },
        { new: true } // Return the updated document
      );

      // Return the updated vehicle with a 200 status code for success
      res.status(200).json(updatedVehicle);
    } else {
      return res
        .status(400)
        .json({ message: "Invalid or missing registration number" });
    }
  } catch (err) {
    // Send a 400 status code for client errors and include error message
    res
      .status(400)
      .json({ message: "Error updating vehicle", error: err.message });
  }
});

export default router;