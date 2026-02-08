import Category from "../model/categories.js";
import { successResponse, errorResponse } from "../utils/responseHandler.js";

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort("name");
    successResponse(res, categories);
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    successResponse(res, category, "Category created", 201);
  } catch (err) {
    next(err);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) return errorResponse(res, "Category not found", 404);
    successResponse(res, category, "Category updated");
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return errorResponse(res, "Category not found", 404);
    successResponse(res, null, "Category deleted");
  } catch (err) {
    next(err);
  }
};
