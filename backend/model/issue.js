import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    member_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    book_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    issued_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    issue_date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    due_date: {
      type: Date,
      required: true,
    },
    return_date: {
      type: Date,
    },
    returned_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["issued", "returned", "overdue", "lost"],
      default: "issued",
    },
    fine_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Fine",
    },
    remarks: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Issue", issueSchema);
