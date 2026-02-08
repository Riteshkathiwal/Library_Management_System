import Role from "../model/roles.js";
import { successResponse, errorResponse } from "../utils/responseHandler.js";

// @desc    Get all roles
// @route   GET /api/roles
// @access  Public (or Private/Admin based on policy)
export const getAllRoles = async (req, res, next) => {
  try {
    const roles = await Role.find();
    successResponse(res, roles);
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new role
// @route   POST /api/roles
// @access  Private (Admin)
export const createRole = async (req, res, next) => {
  try {
    const { role_name, description, permissions } = req.body;

    const roleExists = await Role.findOne({ role_name });
    if (roleExists) {
      return errorResponse(res, "Role already exists", 400);
    }

    const role = await Role.create({
      role_name,
      description,
      permissions,
    });

    successResponse(res, role, "Role created successfully", 201);
  } catch (err) {
    next(err);
  }
};

// @desc    Update a role
// @route   PUT /api/roles/:id
// @access  Private (Admin)
export const updateRole = async (req, res, next) => {
  try {
    const { description, permissions } = req.body;
    
    const role = await Role.findByIdAndUpdate(
      req.params.id,
      { description, permissions },
      { new: true, runValidators: true }
    );

    if (!role) {
      return errorResponse(res, "Role not found", 404);
    }

    successResponse(res, role, "Role updated successfully");
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a role
// @route   DELETE /api/roles/:id
// @access  Private (Admin)
export const deleteRole = async (req, res, next) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);
    if (!role) {
      return errorResponse(res, "Role not found", 404);
    }
    successResponse(res, null, "Role deleted successfully");
  } catch (err) {
    next(err);
  }
};
