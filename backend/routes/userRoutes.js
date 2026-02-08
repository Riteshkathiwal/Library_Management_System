import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes are protected and restricted to Admin
router.use(protect);
router.use(authorize("admin"));

router.route("/").get(getAllUsers);
router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);

export default router;
