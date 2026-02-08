import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    member_id: {
      type: String, // e.g., MEM001
      required: true,
      unique: true,
    },
    membership_type: {
      type: String,
      enum: ["student", "faculty", "public"],
      default: "student",
    },
    membership_start: {
      type: Date,
      default: Date.now,
    },
    membership_expiry: {
      type: Date,
    },
    max_books_allowed: {
      type: Number,
      default: 3,
    },
    current_books_issued: {
      type: Number,
      default: 0,
    },
    total_fines_pending: {
      type: Number,
      default: 0,
    },
    is_blocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Member", memberSchema);
