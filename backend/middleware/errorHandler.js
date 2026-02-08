import { errorResponse } from "../utils/responseHandler.js";

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return errorResponse(res, `Duplicate value for field: ${field}`, 400);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    return errorResponse(res, "Validation Error", 400, messages);
  }

  // Cast Error (Invalid ID)
  if (err.name === "CastError") {
    return errorResponse(res, `Resource not found with id of ${err.value}`, 404);
  }

  return errorResponse(res, err.message || "Internal Server Error", err.statusCode || 500);
};

export default errorHandler;
