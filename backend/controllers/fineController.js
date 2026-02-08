import Fine from "../model/fines.js";
import Member from "../model/members.js";
import { successResponse, errorResponse } from "../utils/responseHandler.js";

// @desc    Get all fines
// @route   GET /api/fines
// @access  Private
export const getAllFines = async (req, res, next) => {
  try {
    const { status, member_id } = req.query;
    let query = {};
    if (status) query.status = status;

    if (req.user.role_id.role_name === "member") {
      const member = await Member.findOne({ user_id: req.user._id });
      if (!member) return errorResponse(res, "Member profile not found", 404);
      query.member_id = member._id;
    } else if (member_id) {
       query.member_id = member_id;
    }

    const fines = await Fine.find(query)
      .populate("member_id", "member_id")
      .populate("issue_id")
      .sort("-created_at");

    successResponse(res, fines);
  } catch (err) {
    next(err);
  }
};

// @desc    Pay fine
// @route   POST /api/fines/:id/pay
// @access  Private (Librarian/Admin)
export const payFine = async (req, res, next) => {
  try {
    const fine = await Fine.findById(req.params.id);
    if (!fine) return errorResponse(res, "Fine not found", 404);

    if (fine.status === "paid") return errorResponse(res, "Fine already paid", 400);

    const amount = req.body.amount || fine.fine_amount;

    fine.status = "paid";
    fine.paid_amount = amount;
    fine.paid_date = new Date();
    fine.collected_by = req.user._id;

    await fine.save();

    // Update Member total fines
    const member = await Member.findById(fine.member_id);
    if (member) {
      member.total_fines_pending = Math.max(0, member.total_fines_pending - fine.fine_amount);
      if (member.total_fines_pending < 500) { // Should check system setting
          member.is_blocked = false;
      }
      await member.save();
    }

    successResponse(res, fine, "Fine paid successfully");
  } catch (err) {
    next(err);
  }
};

// @desc    Waive fine
// @route   POST /api/fines/:id/waive
// @access  Private (Librarian/Admin)
export const waiveFine = async (req, res, next) => {
  try {
    const fine = await Fine.findById(req.params.id);
    if (!fine) return errorResponse(res, "Fine not found", 404);

    if (fine.status !== "pending") return errorResponse(res, "Fine status is not pending", 400);

    fine.status = "waived";
    fine.waive_reason = req.body.reason || "Administrative Waiver";
    fine.waived_by = req.user._id;

    await fine.save();

    // Update Member total fines
    const member = await Member.findById(fine.member_id);
    if (member) {
       member.total_fines_pending = Math.max(0, member.total_fines_pending - fine.fine_amount);
        if (member.total_fines_pending < 500) {
          member.is_blocked = false;
        }
       await member.save();
    }

    successResponse(res, fine, "Fine waived successfully");
  } catch (err) {
    next(err);
  }
};
