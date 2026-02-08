import ActivityLog from "../model/activityLogs.js";
import { successResponse, errorResponse } from "../utils/responseHandler.js";

// @desc    Get all activity logs
// @route   GET /api/activity-logs
// @access  Private (Admin)
export const getAllActivityLogs = async (req, res, next) => {
  try {
    const { user_id, action, entity_type, page = 1, limit = 50 } = req.query;
    
    let query = {};
    
    if (user_id) query.user_id = user_id;
    if (action) query.action = action;
    if (entity_type) query.entity_type = entity_type;

    const skip = (page - 1) * limit;

    const logs = await ActivityLog.find(query)
      .populate("user_id", "name email")
      .sort("-timestamp")
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const total = await ActivityLog.countDocuments(query);

    successResponse(res, {
      logs,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get activity logs for current user
// @route   GET /api/activity-logs/me
// @access  Private
export const getMyActivityLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const logs = await ActivityLog.find({ user_id: req.user._id })
      .sort("-timestamp")
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const total = await ActivityLog.countDocuments({ user_id: req.user._id });

    successResponse(res, {
      logs,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create activity log (utility function)
// @route   POST /api/activity-logs
// @access  Private
export const createActivityLog = async (req, res, next) => {
  try {
    const { action, entity_type, entity_id, details } = req.body;

    const log = await ActivityLog.create({
      user_id: req.user._id,
      action,
      entity_type,
      entity_id,
      details,
      ip_address: req.ip,
      user_agent: req.get("user-agent"),
    });

    successResponse(res, log, "Activity logged successfully", 201);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete old activity logs (cleanup)
// @route   DELETE /api/activity-logs/cleanup
// @access  Private (Admin)
export const cleanupOldLogs = async (req, res, next) => {
  try {
    const { days = 90 } = req.query; // Default: delete logs older than 90 days
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

    const result = await ActivityLog.deleteMany({
      timestamp: { $lt: cutoffDate },
    });

    successResponse(res, {
      deletedCount: result.deletedCount,
      cutoffDate,
    }, `Deleted logs older than ${days} days`);
  } catch (err) {
    next(err);
  }
};
