"use strict";
import customError from "../helpers/customErrorResponse.js";
import storageService from "./storageService.js";
import Vehicle from "./../models/vehicle.js";

// Existing DB rows may still hold the old Firebase URL; only convert Cloudinary public IDs.
const resolveImageUrl = (stored) => {
  if (!stored || stored.startsWith("https://")) return stored;
  return storageService.getImageUrl(stored);
};

const formatVehicle = (vehicle) => {
  const obj = vehicle.toObject();
  obj.stickerImgURL = resolveImageUrl(obj.stickerImgURL);
  return obj;
};

const getVehicles = async (page, limit) => {
  return new Promise(async (resolve, reject) => {
    try {
      const startIndex = (page - 1) * limit;
      const totalVehicles = await Vehicle.countDocuments();
      const vehicles = await Vehicle.find()
        .sort({ createdAt: -1 })
        .skip(startIndex)
        .limit(limit);

      const totalPages = Math.ceil(totalVehicles / limit);

      return resolve({
        isSuccess: true,
        vehiclesData: {
          totalVehicles,
          page,
          totalPages,
          vehicles: vehicles.map(formatVehicle),
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
    try {
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
        vehicleData: formatVehicle(vehicle),
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

const createVehicle = async (body, file) => {
  return new Promise(async (resolve, reject) => {
    const { name, ownerName, regNo, type, roomNo, bldgName } = body;
    let stickerPublicId = "";

    if (file) {
      const fileName = regNo.toString().toLowerCase().replace(/\s+/g, "_");
      try {
        const { publicId } = await storageService.uploadImage(file.buffer, {
          folder: "parking-system/stickers",
          publicId: fileName,
        });
        stickerPublicId = publicId;
      } catch (error) {
        return resolve({
          isSuccess: false,
          message: customError.errorHandler(
            customError.internalServerError,
            `Image upload failed: ${error.message}`
          ),
        });
      }
    }

    const vehicle = await Vehicle.create({
      name,
      ownerName,
      regNo,
      type,
      roomNo,
      bldgName,
      stickerImgURL: stickerPublicId, // public ID stored; URL generated at read time
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
      vehicleData: formatVehicle(vehicle),
      message: "Vehicle created successfully",
    });
  });
};

const updateVehicle = async (id, body, file) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { name, ownerName, regNo, type, roomNo, bldgName } = body;
      const vehicle = await Vehicle.findById(id);

      if (regNo && regNo === vehicle.regNo) {
        if (!vehicle) {
          return resolve({
            isSuccess: false,
            message: customError.errorHandler(
              customError.resourceNotFound,
              "Vehicle not found"
            ),
          });
        }

        let stickerPublicId = vehicle.stickerImgURL; // keep existing public ID (or legacy URL)

        if (file) {
          const fileName = regNo.toString().toLowerCase().replace(/\s+/g, "_");
          try {
            const { publicId } = await storageService.uploadImage(file.buffer, {
              folder: "parking-system/stickers",
              publicId: fileName,
            });
            stickerPublicId = publicId;
          } catch (error) {
            return resolve({
              isSuccess: false,
              message: customError.errorHandler(
                customError.internalServerError,
                `Image upload failed: ${error.message}`
              ),
            });
          }
        }

        const updatedVehicle = await Vehicle.findByIdAndUpdate(
          id,
          {
            name,
            ownerName,
            regNo,
            type,
            roomNo,
            bldgName,
            stickerImgURL: stickerPublicId,
            updatedAt: new Date(),
          },
          { new: true }
        );
        return resolve({
          isSuccess: true,
          vehicleData: formatVehicle(updatedVehicle),
          message: "Vehicle updated successfully",
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
    } catch (error) {
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

const deleteVehicle = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
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

      const stored = vehicle.stickerImgURL;
      if (stored && !stored.startsWith("https://")) {
        // Only attempt Cloudinary deletion for records with a stored public ID
        try {
          await storageService.deleteImage(stored);
          console.log(`Successfully deleted image ${stored} from Cloudinary.`);
        } catch (error) {
          console.error(`Error deleting image from Cloudinary: ${error.message}`);
        }
      }

      await Vehicle.findByIdAndDelete(id);
      return resolve({
        isSuccess: true,
        message: "Vehicle Deleted Successfully",
      });
    } catch (error) {
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

export default {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
