"use strict";
import customError from "../helpers/customErrorResponse.js";
import globalResponse from "../helpers/globalResponse.js";
import vehiclesServices from "../services/vehiclesServices.js";

const getVehicles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
    const data = await vehiclesServices.getVehicles(page, limit);

    if (data.isSuccess) {
      globalResponse.isSuccess = true;
      globalResponse.data = {
        ...data.vehiclesData,
      };
      return res.send(globalResponse);
    }
  } catch (err) {
    return res.send(
      customError.errorHandler(customError.internalServerError, err)
    );
  }
};

const getVehicleById = async (req, res) => {
  try {
    const data = await vehiclesServices.getVehicleById(req.params.id);

    if (data.isSuccess) {
      globalResponse.isSuccess = true;
      globalResponse.data = { vehicleData: data.vehicleData };
      return res.send(globalResponse);
    }
  } catch (err) {
    return res.send(
      customError.errorHandler(customError.internalServerError, err)
    );
  }
};

const createVehicle = async (req, res) => {
  try {
    const { name, ownerName, regNo, type, roomNo, bldgName } = req.body;
    const file = req.file;
    // Passing data to the service layer
    const data = await vehiclesServices.createVehicle(
      { name, ownerName, regNo, type, roomNo, bldgName },
      file
    );

    if (data.isSuccess) {
      globalResponse.isSuccess = true;
      globalResponse.data = { vehicleData: data.vehicleData };
      return res.send(globalResponse);
    }
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Error creating vehicle", error: err.message });
  }
};

const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, ownerName, regNo, type, roomNo, bldgName } = req.body;
    const file = req.file;

    // Passing data to the service layer
    const data = await vehiclesServices.updateVehicle(
      id,
      { name, ownerName, regNo, type, roomNo, bldgName },
      file
    );

    if (data.isSuccess) {
      globalResponse.isSuccess = true;
      globalResponse.data = { vehicleData: data.vehicleData };
      return res.send(globalResponse);
    }
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Error creating vehicle", error: err.message });
  }
};

const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    // Passing data to the service layer
    const data = await vehiclesServices.deleteVehicle(id);

    if (data.isSuccess) {
      globalResponse.isSuccess = true;
      globalResponse.data = { message: data.message };
      return res.send(globalResponse);
    }
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Error creating vehicle", error: err.message });
  }
};

export default {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
