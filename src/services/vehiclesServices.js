"use strict";
import customError from "../helpers/customErrorResponse.js";
import { bucket, storage } from "../helpers/upload.js";
import Vehicle from "./../models/vehicle.js";

const getVehicles = async (page, limit) => {
  return new Promise(async (resolve, reject) => {
    try {
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

      return resolve({
        isSuccess: true,
        vehiclesData: {
          totalVehicles,
          page,
          totalPages,
          vehicles,
        },
      });
    } catch (error) {
      console.log(error);
      return resolve({
        isSuccess: false,
        message: customError.errorHandler(
          customError.internalServerError,
          "SOMETHING_WRONG"
        ),
      });
    }
  });
};

const getVehicleById = async (id) => {
  return new Promise(async (resolve, reject) => {
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      return resolve({
        isSuccess: false,
        message: customError.errorHandler(
          customError.resourceNotFound,
          "Vehicle not found"
        ),
      });
    }
    return resolve({
      isSuccess: true,
      vehicleData: vehicle,
    });
  });
};

const createVehicle = async (body, file) => {
  return new Promise(async (resolve, reject) => {
    const { name, ownerName, regNo, type, roomNo, bldgName } = body;
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
    if (!vehicle) {
      return resolve({
        isSuccess: false,
        message: customError.errorHandler(
          customError.resourceNotFound,
          "Vehicle not found"
        ),
      });
    }
    return resolve({
      isSuccess: true,
      vehicleData: vehicle,
    });
  });
};

const updateVehicle = async (id, body, file) => {
  return new Promise(async (resolve, reject) => {
    const { name, ownerName, regNo, type, roomNo, bldgName } = body;
    const vehicle = await Vehicle.findById(id);

    if (regNo && regNo === vehicle.regNo) {
      let stickerImgURL = "";

      // Find the vehicle by ID
      if (!vehicle) {
        return resolve({
          isSuccess: false,
          message: customError.errorHandler(
            customError.resourceNotFound,
            "Vehicle not found"
          ),
        });
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
      return resolve({
        isSuccess: true,
        vehicleData: updatedVehicle,
      });
    } else {
      return resolve({
        isSuccess: false,
        message: customError.errorHandler(
          customError.badRequest,
          "Vehicle registration number is not right"
        ),
      });
    }
  });
};

const deleteVehicle = async (id) => {
  return new Promise(async (resolve, reject) => {
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      return resolve({
        isSuccess: false,
        message: customError.errorHandler(
          customError.resourceNotFound,
          "Vehicle not found"
        ),
      });
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
    return resolve({
      isSuccess: true,
      message: "Vehicle Deleted Successfully",
    });
  });
};

export default {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
