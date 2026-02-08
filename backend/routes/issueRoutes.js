import express from "express";
import {
  issueBook,
  returnBook,
  getAllIssues,
} from "../controllers/issueController.js";
import { protect, hasPermission } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(protect, getAllIssues)
  .post(protect, hasPermission("issue.create"), issueBook);

router
  .route("/:id/return")
  .put(protect, hasPermission("issue.return"), returnBook);

export default router;
