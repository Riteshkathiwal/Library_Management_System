import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Book title is required"],
      trim: true,
      index: true,
    },
    isbn: {
      type: String,
      unique: true,
      required: [true, "ISBN is required"],
      trim: true,
    },
    author_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
      required: true,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    publisher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Publisher",
      required: true,
    },
    publication_year: {
      type: Number,
    },
    edition: {
      type: String,
    },
    language: {
      type: String,
    },
    pages: {
      type: Number,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 0,
    },
    available: {
      type: Number,
      required: true,
      min: 0,
    },
    shelf_location: {
      type: String,
    },
    description: {
      type: String,
    },
    cover_image: {
      type: String,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search
bookSchema.index({ title: "text", isbn: "text" });

export default mongoose.model("Book", bookSchema);
