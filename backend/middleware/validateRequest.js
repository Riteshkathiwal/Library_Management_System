import { validationResult } from "express-validator";
import { errorResponse } from "../utils/responseHandler.js";

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, "Validation Failed", 400, errors.array());
  }
  next();
};

export default validateRequest;
