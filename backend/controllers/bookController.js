import Book from "../model/book.js";
import { successResponse, errorResponse } from "../utils/responseHandler.js";

// @desc    Get all books with filter, sort, pagination
// @route   GET /api/books
// @access  Public
export const getAllBooks = async (req, res, next) => {
  try {
    const { search, category, author, sort, page = 1, limit = 10 } = req.query;
    
    let query = { is_active: true };

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { isbn: { $regex: search, $options: "i" } },
      ];
    }

    if (category) query.category_id = category;
    if (author) query.author_id = author;

    const skip = (page - 1) * limit;
    
    const books = await Book.find(query)
      .populate("author_id", "name")
      .populate("category_id", "name")
      .populate("publisher_id", "name")
      .sort(sort ? sort : "-createdAt")
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const total = await Book.countDocuments(query);

    successResponse(res, {
      books,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
export const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate("author_id")
      .populate("category_id")
      .populate("publisher_id");

    if (!book) {
      return errorResponse(res, "Book not found", 404);
    }

    successResponse(res, book);
  } catch (err) {
    next(err);
  }
};

// @desc    Create new book
// @route   POST /api/books
// @access  Private (Librarian/Admin)
export const createBook = async (req, res, next) => {
  try {
    const book = await Book.create({
      ...req.body,
      available: req.body.quantity, // Initially available = quantity
    });

    successResponse(res, book, "Book created successfully", 201);
  } catch (err) {
    next(err);
  }
};

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Private (Librarian/Admin)
export const updateBook = async (req, res, next) => {
  try {
    let book = await Book.findById(req.params.id);

    if (!book) {
      return errorResponse(res, "Book not found", 404);
    }

    // Logic to adjust available count if quantity changes could be added here
    // For now simple update
    book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    successResponse(res, book, "Book updated successfully");
  } catch (err) {
    next(err);
  }
};

// @desc    Delete book (soft delete)
// @route   DELETE /api/books/:id
// @access  Private (Librarian/Admin)
export const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { is_active: false },
      { new: true }
    );

    if (!book) {
      return errorResponse(res, "Book not found", 404);
    }

    successResponse(res, null, "Book deleted successfully");
  } catch (err) {
    next(err);
  }
};
