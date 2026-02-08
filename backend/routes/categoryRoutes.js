import express from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { protect, hasPermission } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(getCategories)
  .post(protect, hasPermission("category.create"), createCategory);

router
  .route("/:id")
  .put(protect, hasPermission("category.update"), updateCategory)
  .delete(protect, hasPermission("category.delete"), deleteCategory);

export default router;
