import express from "express";
import {
  getAllRequests,
  createRequest,
  processRequest,
} from "../controllers/requestController.js";
import { protect, hasPermission } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(protect, getAllRequests)
  .post(protect, createRequest);

router.route("/:id/process").put(protect, hasPermission("request.manage"), processRequest);

export default router;
