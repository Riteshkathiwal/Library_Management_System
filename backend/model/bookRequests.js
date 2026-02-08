import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
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
    request_date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "pending",
    },
    processed_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    processed_date: {
      type: Date,
    },
    remarks: {
      type: String,
    },
    priority: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("BookRequest", requestSchema);
