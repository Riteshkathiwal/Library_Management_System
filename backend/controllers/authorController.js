import Author from "../model/authors.js";
import { successResponse, errorResponse } from "../utils/responseHandler.js";

export const getAuthors = async (req, res, next) => {
  try {
    const authors = await Author.find().sort("name");
    successResponse(res, authors);
  } catch (err) {
    next(err);
  }
};

export const createAuthor = async (req, res, next) => {
  try {
    const author = await Author.create(req.body);
    successResponse(res, author, "Author created", 201);
  } catch (err) {
    next(err);
  }
};

export const updateAuthor = async (req, res, next) => {
  try {
    const author = await Author.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!author) return errorResponse(res, "Author not found", 404);
    successResponse(res, author, "Author updated");
  } catch (err) {
    next(err);
  }
};

export const deleteAuthor = async (req, res, next) => {
  try {
    const author = await Author.findByIdAndDelete(req.params.id);
    if (!author) return errorResponse(res, "Author not found", 404);
    successResponse(res, null, "Author deleted");
  } catch (err) {
    next(err);
  }
};
