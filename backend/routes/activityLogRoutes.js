import express from "express";
import {
  getAllActivityLogs,
  getMyActivityLogs,
  createActivityLog,
  cleanupOldLogs,
} from "../controllers/activityLogController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // All routes require authentication

router.route("/")
  .get(authorize("admin"), getAllActivityLogs)
  .post(createActivityLog);

router.get("/me", getMyActivityLogs);

router.delete("/cleanup", authorize("admin"), cleanupOldLogs);

export default router;
