"use strict";
import customError from "../helpers/customErrorResponse.js";
import globalResponse from "../helpers/globalResponse.js";
import adminServices from "../services/adminServices.js";

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.send(
      customError.errorHandler(
        customError.badRequest,
        "Please provide email and password"
      )
    );
  }
  try {
    const data = await adminServices.loginAdmin(email, password);
    if (data.isSuccess) {
      globalResponse.isSuccess = true;
      globalResponse.data = { token: data.data };
      return res.send(globalResponse);
    }
  } catch (err) {
    return res.send(
      customError.errorHandler(customError.internalServerError, err)
    );
  }
};

const createAdmin = async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.send(
      customError.errorHandler(
        customError.badRequest,
        "Please provide email and password"
      )
    );
  }
  try {
    const data = await adminServices.createAdmin(email, password, name);
    if (data.isSuccess) {
      globalResponse.isSuccess = true;
      globalResponse.data = { message: data.message };
      return res.send(globalResponse);
    }
  } catch (err) {
    return res.send(
      customError.errorHandler(customError.internalServerError, err)
    );
  }
};

export default {
  loginAdmin,
  createAdmin,
};
