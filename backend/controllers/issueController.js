import Issue from "../model/issue.js";
import Book from "../model/book.js";
import Member from "../model/members.js";
import Fine from "../model/fines.js";
import SystemSetting from "../model/systemSettings.js";
import { successResponse, errorResponse } from "../utils/responseHandler.js";

// @desc    Issue a book
// @route   POST /api/issues
// @access  Private (Librarian/Admin)
export const issueBook = async (req, res, next) => {
  try {
    const { member_id, book_id } = req.body;

    // 1. Check if member exists and can issue
    const member = await Member.findById(member_id);
    if (!member) return errorResponse(res, "Member not found", 404);

    if (member.is_blocked) {
      return errorResponse(res, "Member is blocked from issuing books", 400);
    }

    if (member.current_books_issued >= member.max_books_allowed) {
      return errorResponse(
        res,
        `Member has reached maximum limit of ${member.max_books_allowed} books`,
        400
      );
    }

    // 2. Check if book exists and is available
    const book = await Book.findById(book_id);
    if (!book) return errorResponse(res, "Book not found", 404);

    if (book.available < 1) {
      return errorResponse(res, "Book is not available", 400);
    }

    // 3. Get system settings for due date
    let maxDays = 14; // Default
    const setting = await SystemSetting.findOne({ key: "max_issue_days" });
    if (setting) maxDays = parseInt(setting.return_value);

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + maxDays);

    // 4. Create Issue Record
    const issue = await Issue.create({
      member_id,
      book_id,
      issued_by: req.user._id,
      due_date: dueDate,
      status: "issued",
    });

    // 5. Update Book availability
    book.available -= 1;
    await book.save();

    // 6. Update Member stats
    member.current_books_issued += 1;
    await member.save();

    successResponse(res, issue, "Book issued successfully", 201);
  } catch (err) {
    next(err);
  }
};

// @desc    Return a book
// @route   PUT /api/issues/:id/return
// @access  Private (Librarian/Admin)
export const returnBook = async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id);
    
    if (!issue) return errorResponse(res, "Issue record not found", 404);
    if (issue.status !== "issued" && issue.status !== "overdue") {
      return errorResponse(res, "Book is already returned", 400);
    }

    const returnDate = new Date();
    issue.return_date = returnDate;
    issue.returned_to = req.user._id;
    issue.status = "returned";

    // 1. Calculate Fine if overdue
    if (returnDate > issue.due_date) {
      const diffTime = Math.abs(returnDate - issue.due_date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Get fine rate
      let fineRate = 5; // Default
      const setting = await SystemSetting.findOne({ key: "fine_rate_per_day" });
      if (setting) fineRate = parseInt(setting.return_value);

      const fineAmount = diffDays * fineRate;

      // Create Fine Record
      const fine = await Fine.create({
        issue_id: issue._id,
        member_id: issue.member_id,
        fine_amount: fineAmount,
        days_overdue: diffDays,
        fine_rate_per_day: fineRate,
        fine_reason: "overdue",
      });

      issue.fine_id = fine._id;
      
      // Update Member fines
      const member = await Member.findById(issue.member_id);
      member.total_fines_pending += fineAmount;
      // Check for block
      let maxFine = 500;
      const blockSetting = await SystemSetting.findOne({ key: "max_fine_before_block" });
      if (blockSetting) maxFine = parseInt(blockSetting.return_value);
      
      if (member.total_fines_pending > maxFine) {
        member.is_blocked = true;
      }
      await member.save();
    }

    // 2. Update Book availability
    const book = await Book.findById(issue.book_id);
    if (book) {
      book.available += 1;
      await book.save();
    }

    // 3. Update Member stats
    const member = await Member.findById(issue.member_id);
    if (member) {
      member.current_books_issued = Math.max(0, member.current_books_issued - 1);
      await member.save();
    }

    await issue.save();

    successResponse(res, issue, "Book returned successfully");
  } catch (err) {
    next(err);
  }
};

// @desc    Get all issues
// @route   GET /api/issues
// @access  Private
export const getAllIssues = async (req, res, next) => {
  try {
    const { status, member_id, overdue } = req.query;
    let query = {};

    if (status) query.status = status;
    if (member_id) query.member_id = member_id; // For admin/librarian to filter

    // Member can only see own issues
    if (req.user.role_id.role_name === "member") {
      const member = await Member.findOne({ user_id: req.user._id });
      if (!member) return errorResponse(res, "Member profile not found", 404);
      query.member_id = member._id;
    }

    if (overdue === "true") {
       query.due_date = { $lt: new Date() };
       query.status = "issued";
    }

    const issues = await Issue.find(query)
      .populate("book_id", "title isbn")
      .populate("member_id", "member_id")
      .populate("issued_by", "name")
      .sort("-issue_date");

    successResponse(res, issues);
  } catch (err) {
    next(err);
  }
};
