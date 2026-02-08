import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    entity_type: {
      type: String,
    },
    entity_id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    details: {
      type: Object,
    },
    ip_address: {
      type: String,
    },
    user_agent: {
      type: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }
);

// Index for filtering
activityLogSchema.index({ user_id: 1, action: 1, timestamp: -1 });

export default mongoose.model("ActivityLog", activityLogSchema);
