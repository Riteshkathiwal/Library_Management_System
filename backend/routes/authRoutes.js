import express from "express";
import { check } from "express-validator";
import { register, login, getMe, updatePassword } from "../controllers/authController.js";
import validateRequest from "../middleware/validateRequest.js";
import { protect, hasPermission } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Please enter a password with 6 or more characters").isLength({ min: 6 }),
    check("mobile", "Mobile number is required").not().isEmpty(),
  ],
  validateRequest,
  register
);

router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  validateRequest,
  login
);

router.put(
  "/updatepassword",
  [
    check("currentPassword", "Current password is required").exists(),
    check("newPassword", "Please enter a password with 6 or more characters").isLength({ min: 6 }),
  ],
  validateRequest,
  protect,
  hasPermission('user.change_password'),
  updatePassword
);

router.get("/me", protect, getMe);

export default router;
