import express from "express";
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/bookController.js";
import { protect, hasPermission } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(getAllBooks)
  .post(protect, hasPermission("book.create"), createBook);

router
  .route("/:id")
  .get(getBookById)
  .put(protect, hasPermission("book.update"), updateBook)
  .delete(protect, hasPermission("book.delete"), deleteBook);

export default router;
