"use strict";
import customResponse from "./globalResponse.js";

const customError = {
  noContent: 204,
  badRequest: 400,
  notAuthorized: 401,
  Forbidden: 403,
  resourceNotFound: 404,
  internalServerError: 500,
  ServiceUnavailable: 503,
  alreadyExist: 409,
  errorHandler: (type, message) => {
    customResponse.data = {};
    customResponse.error = {
      error: type,
      errorDescription: message,
    };
    customResponse.isSuccess = false;
    return customResponse;
  },
};

export default customError;
