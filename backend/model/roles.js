import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    role_name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true, // admin, librarian, member
    },
    description: {
      type: String,
      trim: true,
    },
    permissions: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Role", roleSchema);
