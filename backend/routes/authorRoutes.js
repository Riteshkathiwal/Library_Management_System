import express from "express";
import {
  getAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} from "../controllers/authorController.js";
import { protect, hasPermission } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(getAuthors)
  .post(protect, hasPermission("author.create"), createAuthor);

router
  .route("/:id")
  .put(protect, hasPermission("author.update"), updateAuthor)
  .delete(protect, hasPermission("author.delete"), deleteAuthor);

export default router;
