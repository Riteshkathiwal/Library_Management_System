import Publisher from "../model/publishers.js";
import { successResponse, errorResponse } from "../utils/responseHandler.js";

export const getPublishers = async (req, res, next) => {
  try {
    const publishers = await Publisher.find().sort("name");
    successResponse(res, publishers);
  } catch (err) {
    next(err);
  }
};

export const createPublisher = async (req, res, next) => {
  try {
    const publisher = await Publisher.create(req.body);
    successResponse(res, publisher, "Publisher created", 201);
  } catch (err) {
    next(err);
  }
};

export const updatePublisher = async (req, res, next) => {
  try {
    const publisher = await Publisher.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!publisher) return errorResponse(res, "Publisher not found", 404);
    successResponse(res, publisher, "Publisher updated");
  } catch (err) {
    next(err);
  }
};

export const deletePublisher = async (req, res, next) => {
  try {
    const publisher = await Publisher.findByIdAndDelete(req.params.id);
    if (!publisher) return errorResponse(res, "Publisher not found", 404);
    successResponse(res, null, "Publisher deleted");
  } catch (err) {
    next(err);
  }
};
