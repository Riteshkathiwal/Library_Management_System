import User from "../model/user.js";
import Role from "../model/roles.js";
import Member from "../model/members.js";
import { successResponse, errorResponse } from "../utils/responseHandler.js";

// @desc    Register a user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role_name, mobile, address } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return errorResponse(res, "Email already registered", 400);
    }

    // Find role
    const role = await Role.findOne({ role_name: role_name || "member" });
    if (!role) {
      return errorResponse(res, "Invalid role specified", 400);
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role_id: role._id,
      mobile,
      address,
    });

    // If role is member, create member profile
    if (role.role_name === "member") {
      // Generate member ID (e.g., MEM + Timestamp)
      const memberId = "MEM" + Date.now().toString().slice(-6);
      
      await Member.create({
        user_id: user._id,
        member_id: memberId,
        membership_type: "student", // Default
        membership_expiry: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // 1 year validity
      });
    }

    sendTokenResponse(user, 201, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return errorResponse(res, "Please provide an email and password", 400);
    }

    // Check for user
    const user = await User.findOne({ email }).select("+password").populate("role_id");

    if (!user) {
      return errorResponse(res, "Invalid credentials", 401);
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return errorResponse(res, "Invalid credentials", 401);
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Update user password
// @route   PUT /api/auth/updatepassword
// @access  Private
export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user from database with password
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    if (!(await user.matchPassword(currentPassword))) {
      return errorResponse(res, 'Invalid current password', 401);
    }

    // Set new password
    user.password = newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate("role_id");
    
    let memberData = null;
    if (user.role_id.role_name === "member") {
      memberData = await Member.findOne({ user_id: user._id });
    }

    successResponse(res, { user, member: memberData }, "User profile fetched successfully");
  } catch (err) {
    next(err);
  }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // We need to fetch the role name if it's not populated
  // But usually for register/login we might need to populate it or just pass it if we have it
  // For simplicity, let's assume we might need to populate if role_id is just an ID
  
  const token = user.getSignedJwtToken(user.role_id);

  const options = {
    expires: new Date(
      Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role_id,
      }
    });
};
