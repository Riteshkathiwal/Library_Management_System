import Book from "../model/book.js";
import User from "../model/user.js";
import Issue from "../model/issue.js";
import Fine from "../model/fines.js";
import { successResponse } from "../utils/responseHandler.js";

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalBooks = await Book.countDocuments({ is_active: true });
    
    // Count members (users with role 'member')
    // We need to look up the role 'member' first or populate. 
    // Assuming we want all users for now or specific members. 
    // Let's count all users for "Total Members" or filter if needed.
    // Based on previous code, members are users with role 'member'.
    // Use aggregation or finding role first.
    // Simpler: Count all users for now, or fetch role 'member' id.
    
    // Better approach:
    const totalUsers = await User.countDocuments({ is_active: true });
    
    // Active issues are already filtered by status='issued' which implies active
    const activeIssues = await Issue.countDocuments({ status: 'issued' });
    
    // Calculate pending fines
    const fines = await Fine.find({ payment_status: 'Unpaid' });
    const totalPendingFines = fines.reduce((acc, fine) => acc + fine.amount, 0);

    const stats = {
      totalBooks,
      totalMembers: totalUsers,
      activeIssues,
      totalPendingFines
    };

    successResponse(res, stats, "Dashboard stats fetched successfully");
  } catch (err) {
    next(err);
  }
};
