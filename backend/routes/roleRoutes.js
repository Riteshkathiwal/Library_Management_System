import express from "express";
import {
  getAllRoles,
  createRole,
  updateRole,
  deleteRole,
} from "../controllers/roleController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
    .get(getAllRoles)
    .post(createRole); 
    // .post(protect, authorize("admin"), createRole); // Uncomment to protect

router.route("/:id")
    .put(updateRole)
    .delete(deleteRole);
    // .put(protect, authorize("admin"), updateRole) // Uncomment to protect
    // .delete(protect, authorize("admin"), deleteRole); // Uncomment to protect

export default router;
