import BookRequest from "../model/bookRequests.js";
import Member from "../model/members.js";
import { successResponse, errorResponse } from "../utils/responseHandler.js";

// @desc    Get all requests
// @route   GET /api/requests
// @access  Private
export const getAllRequests = async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role_id.role_name === "member") {
      const member = await Member.findOne({ user_id: req.user._id });
      if (!member) return errorResponse(res, "Member profile not found", 404);
      query.member_id = member._id;
    } else {
        const { status } = req.query;
        if (status) query.status = status;
    }

    const requests = await BookRequest.find(query)
      .populate("book_id", "title")
      .populate("member_id", "member_id")
      .sort("-request_date");

    successResponse(res, requests);
  } catch (err) {
    next(err);
  }
};

// @desc    Create request
// @route   POST /api/requests
// @access  Private (Member)
export const createRequest = async (req, res, next) => {
  try {
    const member = await Member.findOne({ user_id: req.user._id });
    if (!member) return errorResponse(res, "Member profile not found", 404);

    const existingRequest = await BookRequest.findOne({
      member_id: member._id,
      book_id: req.body.book_id,
      status: "pending",
    });

    if (existingRequest) {
      return errorResponse(res, "You already have a pending request for this book", 400);
    }

    const request = await BookRequest.create({
      member_id: member._id,
      book_id: req.body.book_id,
      status: "pending",
    });

    successResponse(res, request, "Book requested successfully", 201);
  } catch (err) {
    next(err);
  }
};

// @desc    Process request
// @route   PUT /api/requests/:id/process
// @access  Private (Librarian/Admin)
export const processRequest = async (req, res, next) => {
  try {
    const { status, remarks } = req.body; // status: approved, rejected
    
    if (!["approved", "rejected"].includes(status)) {
        return errorResponse(res, "Invalid status", 400);
    }

    const request = await BookRequest.findByIdAndUpdate(
      req.params.id,
      {
        status,
        remarks,
        processed_by: req.user._id,
        processed_date: new Date()
      },
      { new: true }
    );

    if (!request) return errorResponse(res, "Request not found", 404);

    successResponse(res, request, `Request ${status}`);
  } catch (err) {
    next(err);
  }
};
