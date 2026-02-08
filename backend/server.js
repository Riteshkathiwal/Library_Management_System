import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import errorHandler from "./middleware/errorHandler.js";
import cors from "cors";

// Route files
import auth from "./routes/authRoutes.js";
import books from "./routes/bookRoutes.js";
import authors from "./routes/authorRoutes.js";
import categories from "./routes/categoryRoutes.js";
import publishers from "./routes/publisherRoutes.js";
import issues from "./routes/issueRoutes.js";
import fines from "./routes/fineRoutes.js";
import requests from "./routes/requestRoutes.js";
import users from "./routes/userRoutes.js";
import roles from "./routes/roleRoutes.js";
import activityLogs from "./routes/activityLogRoutes.js";
import dashboard from "./routes/dashboardRoutes.js";

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Enable CORS
app.use(cors());

// Body parser
app.use(express.json());

// Mount routers
app.use("/api/auth", auth);
app.use("/api/roles", roles);
app.use("/api/users", users);
app.use("/api/books", books);
app.use("/api/authors", authors);
app.use("/api/categories", categories);
app.use("/api/publishers", publishers);
app.use("/api/issues", issues);
app.use("/api/fines", fines);

app.use("/api/requests", requests);
app.use("/api/activity-logs", activityLogs);
app.use("/api/dashboard", dashboard);

app.get("/", (req, res) => {
  res.send("Library Management API Running");
});

// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port http://localhost:${PORT}`);
});
