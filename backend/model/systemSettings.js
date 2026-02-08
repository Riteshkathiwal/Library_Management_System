import mongoose from "mongoose";

const systemSettingSchema = new mongoose.Schema(
  {
    setting_key: {
      type: String,
      required: true,
      unique: true,
    },
    setting_value: {
      type: String,
      required: true,
    },
    data_type: {
      type: String,
      enum: ["number", "string", "boolean", "json"],
      required: true,
    },
    description: {
      type: String,
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("SystemSetting", systemSettingSchema);
