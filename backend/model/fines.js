import mongoose from "mongoose";

const fineSchema = new mongoose.Schema(
  {
    issue_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      unique: true,
    },
    member_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    fine_amount: {
      type: Number,
      required: true,
      min: 0,
    },
    fine_reason: {
      type: String,
      enum: ["overdue", "lost", "damaged"],
      default: "overdue",
    },
    days_overdue: {
      type: Number,
      default: 0,
    },
    fine_rate_per_day: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "waived"],
      default: "pending",
    },
    paid_amount: {
      type: Number,
      default: 0,
    },
    paid_date: {
      type: Date,
    },
    collected_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    waived_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    waive_reason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Fine", fineSchema);
