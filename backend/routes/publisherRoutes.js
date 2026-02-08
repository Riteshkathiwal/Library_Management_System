import express from "express";
import {
  getPublishers,
  createPublisher,
  updatePublisher,
  deletePublisher,
} from "../controllers/publisherController.js";
import { protect, hasPermission } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(getPublishers)
  .post(protect, hasPermission("publisher.create"), createPublisher);

router
  .route("/:id")
  .put(protect, hasPermission("publisher.update"), updatePublisher)
  .delete(protect, hasPermission("publisher.delete"), deletePublisher);

export default router;
