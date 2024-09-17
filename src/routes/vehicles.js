"use strict";
import express from "express";
import Vehicle from "../models/vehicle.js";

import admin from "firebase-admin";

const router = express.Router();

import multer from "multer";
import { Storage } from "@google-cloud/storage";
import authMiddleware from "../auth/authMiddleware.js";
import config from "../config/index.js";
import vehicleController from "../controllers/vehicleController.js";

if (!config.FIREBASE_PRIVATE_KEY) {
  throw new Error(
    "FIREBASE_PRIVATE_KEY is undefined. Please check your environment variable settings."
  );
}

const privateKey = config.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");

const storage = new Storage({
  projectId: config.FIREBASE_PROJECT_ID,
  credentials: {
    private_key: privateKey,
    client_email: config.FIREBASE_CLIENT_EMAIL,
  },
});

// Initialize Firebase Admin and Storage Bucket
admin.initializeApp({
  credential: admin.credential.cert({
    type: config.FIREBASE_TYPE,
    project_id: config.FIREBASE_PROJECT_ID,
    private_key_id: config.FIREBASE_PRIVATE_KEY_ID,
    private_key: privateKey, // Ensure newlines are handled
    client_email: config.FIREBASE_CLIENT_EMAIL,
    client_id: config.FIREBASE_CLIENT_ID,
    auth_uri: config.FIREBASE_AUTH_URI,
    token_uri: config.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: config.FIREBASE_AUTH_CERT_URL,
    client_x509_cert_url: config.FIREBASE_CLIENT_CERT_URL,
    universe_domain: config.FIREBASE_UNIVERSE_DOMAIN,
  }),
  storageBucket: config.STORAGE_BUCKET,
});

const bucket = admin.storage().bucket();

// Multer setup to handle image upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10000000 }, // 10MB file size limit
}).single("stickerImgURL");

// Get all vehicles
router.get("/", authMiddleware, vehicleController.getVehicles);

// Get vehicle by ID
router.get("/:id", authMiddleware, vehicleController.getVehicleById);

// Create a new Vehicle with an image upload
router.post("/create", upload, authMiddleware, async (req, res) => {
  try {
    const { name, ownerName, regNo, type, roomNo, bldgName } = req.body;
    const file = req.file;

    let stickerImgURL = "";

    // Check if an image file is provided
    if (file) {
      // Generate unique file name
      const fileName = regNo.toString().toLowerCase().replace(/\s+/g, "_");

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
    res.status(201).json({ vehicle, message: "Vehicle created successfully" });
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
    const { name, ownerName, regNo, type, roomNo, bldgName } = req.body;
    const file = req.file;
    const vehicle = await Vehicle.findById(id);
    if (regNo && regNo === vehicle.regNo) {
      let stickerImgURL = "";

      // Find the vehicle by ID
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }

      // Check if an image file is provided
      if (file) {
        // Generate unique file name
        const fileName = regNo.toString().toLowerCase().replace(/\s+/g, "_");

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
      res
        .status(200)
        .json({ vehicle, message: "Vehicle updated successfully" });
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

router.post("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Find the vehicle by ID
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    const stickerImgURL = vehicle.stickerImgURL;

    // Check if the vehicle has an image URL
    if (stickerImgURL) {
      // Extract the file name from the image URL
      const fileName = stickerImgURL.split("/").pop();

      // Delete the image from Firebase Storage
      await storage
        .bucket(bucket.name)
        .file(fileName)
        .delete()
        .then(() => {
          console.log(`Successfully deleted file ${fileName} from Firebase.`);
        })
        .catch((error) => {
          console.error(`Error deleting file from Firebase: ${error.message}`);
        });
    }

    // Delete the vehicle document from MongoDB
    await Vehicle.findByIdAndDelete(id);

    // Return a success message
    res.status(200).json({ message: "Vehicle and image deleted successfully" });
  } catch (err) {
    // Handle errors and send response
    res
      .status(400)
      .json({ message: "Error deleting vehicle", error: err.message });
  }
});

export default router;
