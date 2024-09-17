"use strict";
import customError from "../helpers/customErrorResponse.js";
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

export default {
  getVehicles,
  getVehicleById,
};
