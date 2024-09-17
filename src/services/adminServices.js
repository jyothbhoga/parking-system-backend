"use strict";
import generateToken from "../auth/generateToken.js";
import customError from "../helpers/customErrorResponse.js";
import Admin from "./../models/admin.js";
import bcrypt from "bcryptjs";

const loginAdmin = async (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return res.send(
          customError.errorHandler(
            customError.badRequest,
            "Invalid email or password."
          )
        );
      }

      // Check if the password is correct
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.send(
          customError.errorHandler(
            customError.badRequest,
            "Invalid email or password."
          )
        );
      }

      // Generate a JWT token
      const token = generateToken(admin);

      // Send token to client
      return resolve({
        isSuccess: true,
        message: "Vehicle Deleted Successfully",
        data: token,
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

const createAdmin = async (email, password, name) => {
  return new Promise(async (resolve, reject) => {
    try {
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.send(
          customError.errorHandler(
            customError.badRequest,
            "Admin already exists"
          )
        );
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

      return resolve({
        isSuccess: true,
        message: "Admin created successfully",
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

export default { loginAdmin, createAdmin };
