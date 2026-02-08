import mongoose from "mongoose";

const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
    },
    biography: {
      type: String,
    },
    country: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Author", authorSchema);
