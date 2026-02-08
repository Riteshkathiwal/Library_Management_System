import express from "express";
import {
  getAllFines,
  payFine,
  waiveFine,
} from "../controllers/fineController.js";
import { protect, hasPermission } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getAllFines);

router.route("/:id/pay").post(protect, hasPermission("fine.pay"), payFine);
router.route("/:id/waive").post(protect, hasPermission("fine.waive"), waiveFine);

export default router;
