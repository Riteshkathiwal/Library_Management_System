import User from "../model/user.js";
import { successResponse, errorResponse } from "../utils/responseHandler.js";

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin)
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().populate("role_id");
    successResponse(res, users);
  } catch (err) {
    next(err);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private (Admin)
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate("role_id");
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }
    successResponse(res, user);
  } catch (err) {
    next(err);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin)
export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }); // Be careful not to update password here directly without hashing if passed

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    successResponse(res, user, "User updated successfully");
  } catch (err) {
    next(err);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }
    successResponse(res, null, "User deleted successfully");
  } catch (err) {
    next(err);
  }
};
