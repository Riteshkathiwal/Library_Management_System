export const APP_NAME = process.env.REACT_APP_APP_NAME || 'Library Management System';
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

export const MODULES = {
  DASHBOARD: 'Dashboard',
  USERS: 'Users',
  ROLES: 'Roles',
  BOOKS: 'Books',
  AUTHORS: 'Authors',
  CATEGORIES: 'Categories',
  PUBLISHERS: 'Publishers',
  ISSUES: 'Issues',
  FINES: 'Fines',
  REQUESTS: 'Book Requests',
  ACTIVITY_LOGS: 'Activity Logs',
};

export const PERMISSIONS = {
  // User permissions
  USER_CREATE: 'user.create',
  USER_READ: 'user.read',
  USER_UPDATE: 'user.update',
  USER_DELETE: 'user.delete',
  USER_CHANGE_PASSWORD: 'user.change_password',
  
  // Role permissions
  ROLE_CREATE: 'role.create',
  ROLE_READ: 'role.read',
  ROLE_UPDATE: 'role.update',
  ROLE_DELETE: 'role.delete',
  
  // Book permissions
  BOOK_CREATE: 'book.create',
  BOOK_READ: 'book.read',
  BOOK_UPDATE: 'book.update',
  BOOK_DELETE: 'book.delete',
  
  // Author permissions
  AUTHOR_CREATE: 'author.create',
  AUTHOR_UPDATE: 'author.update',
  AUTHOR_DELETE: 'author.delete',
  
  // Category permissions
  CATEGORY_CREATE: 'category.create',
  CATEGORY_UPDATE: 'category.update',
  CATEGORY_DELETE: 'category.delete',
  
  // Publisher permissions
  PUBLISHER_CREATE: 'publisher.create',
  PUBLISHER_UPDATE: 'publisher.update',
  PUBLISHER_DELETE: 'publisher.delete',
  
  // Issue permissions
  ISSUE_CREATE: 'issue.create',
  ISSUE_RETURN: 'issue.return',
  
  // Fine permissions
  FINE_PAY: 'fine.pay',
  FINE_WAIVE: 'fine.waive',
  
  // Request permissions
  REQUEST_CREATE: 'request.create',
  REQUEST_MANAGE: 'request.manage',
  
  // Admin wildcard
  ALL: '*',
};

export const ROLES = {
  ADMIN: 'admin',
  LIBRARIAN: 'librarian',
  MEMBER: 'member',
};

export const STORAGE_KEYS = {
  TOKEN: 'library_token',
  USER: 'library_user',
  THEME: 'library_theme',
};

export default {
  APP_NAME,
  API_BASE_URL,
  MODULES,
  PERMISSIONS,
  ROLES,
  STORAGE_KEYS,
};
