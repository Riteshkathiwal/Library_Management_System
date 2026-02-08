import jwt from "jsonwebtoken";
import User from "../model/user.js";
import Role from "../model/roles.js";
import { errorResponse } from "../utils/responseHandler.js";

// Protect routes
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(" ")[1];
  }

  // Make sure token exists
  if (!token) {
    return errorResponse(res, "Not authorized to access this route", 401);
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user to request
    req.user = await User.findById(decoded.id).populate("role_id");

    if (!req.user) {
      return errorResponse(res, "User not found", 404);
    }

    if (!req.user.is_active) {
      return errorResponse(res, "User account is deactivated", 403);
    }

    next();
  } catch (err) {
    return errorResponse(res, "Not authorized to access this route", 401);
  }
};

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user.role_id || !roles.includes(req.user.role_id.role_name)) {
      return errorResponse(
        res,
        `User role ${req.user.role_id.role_name} is not authorized to access this route`,
        403
      );
    }
    next();
  };
};

// Check for specific permission
export const hasPermission = (permission) => {
  return (req, res, next) => {
    const userPermissions = req.user.role_id.permissions || [];
    
    // Admin usually has all permissions (represented by '*')
    if (userPermissions.includes("*") || userPermissions.includes(permission)) {
      return next();
    }

    return errorResponse(
      res,
      `Permission denied: ${permission} required`,
      403
    );
  };
};
