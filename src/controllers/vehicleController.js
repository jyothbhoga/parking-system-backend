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
      globalResponse.error = { error: "", errorDescription: "" };
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
      globalResponse.data = data;
      globalResponse.error = { error: "", errorDescription: "" };
      return res.send(globalResponse);
    }
  } catch (err) {
    return res.send(
      customError.errorHandler(customError.internalServerError, err)
    );
  }
};

export default {
  getVehicles,
  getVehicleById,
};
