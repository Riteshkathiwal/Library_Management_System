import mongoose from "mongoose";

const publisherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Publisher name is required"],
      trim: true,
    },
    address: {
      type: String,
    },
    website: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Publisher", publisherSchema);
