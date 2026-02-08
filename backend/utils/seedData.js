import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import Role from "../model/roles.js";
import User from "../model/user.js";
import SystemSetting from "../model/systemSettings.js";
import connectDB from "../config/db.js";

dotenv.config();

connectDB();

const importData = async () => {
  try {
    // 1. Clear existing data
    await Role.deleteMany();
    await User.deleteMany();
    await SystemSetting.deleteMany();

    // 2. Create Roles
    const roles = await Role.create([
      {
        role_name: "admin",
        description: "System Administrator with full access",
        permissions: ["*"], // Wildcard for all permissions
      },
      {
        role_name: "librarian",
        description: "Library Staff managing books and issues",
        permissions: [
          "book.create",
          "book.update",
          "book.delete",
          "member.read",
          "member.update",
          "issue.create",
          "issue.return",
          "fine.pay",
          "fine.waive",
          "request.manage",
          "author.create",
          "author.update",
          "author.delete",
          "category.create",
          "category.update",
          "category.delete",
          "publisher.create",
          "publisher.update",
          "publisher.delete",
        ],
      },
      {
        role_name: "member",
        description: "Library Member who borrows books",
        permissions: ["book.read", "member.read_self", "request.create"],
      },
    ]);

    const adminRole = roles.find((r) => r.role_name === "admin");

    // 3. Create Admin User
    await User.create({
      name: "Admin User",
      email: "admin@library.com",
      password: "password123", // Will be hashed by pre-save hook
      role_id: adminRole._id,
      mobile: "1234567890",
      address: "Admin HQ",
      is_active: true,
    });

    // 4. Create System Settings
    await SystemSetting.create([
      {
        setting_key: "max_issue_days",
        setting_value: "14",
        data_type: "number",
        description: "Maximum days a book can be issued",
      },
      {
        setting_key: "fine_rate_per_day",
        setting_value: "5",
        data_type: "number",
        description: "Fine amount per day for overdue books",
      },
      {
        setting_key: "max_books_allowed",
        setting_value: "3",
        data_type: "number",
        description: "Maximum books a member can hold",
      },
      {
        setting_key: "max_fine_before_block",
        setting_value: "500",
        data_type: "number",
        description: "Maximum usage fine before member is blocked",
      },
    ]);

    console.log("Data Imported!".green.inverse);
    process.exit();
  } catch (err) {
    console.error(`${err}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Role.deleteMany();
    await User.deleteMany();
    await SystemSetting.deleteMany();
    // Add other deletions here if needed

    console.log("Data Destroyed!".red.inverse);
    process.exit();
  } catch (err) {
    console.error(`${err}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
