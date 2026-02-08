export const API_URLS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  GET_ME: '/auth/me',

  // Users
  USERS: '/users',
  USER_BY_ID: (id) => `/users/${id}`,

  // Roles
  ROLES: '/roles',
  ROLE_BY_ID: (id) => `/roles/${id}`,

  // Books
  BOOKS: '/books',
  BOOK_BY_ID: (id) => `/books/${id}`,

  // Authors
  AUTHORS: '/authors',
  AUTHOR_BY_ID: (id) => `/authors/${id}`,

  // Categories
  CATEGORIES: '/categories',
  CATEGORY_BY_ID: (id) => `/categories/${id}`,

  // Publishers
  PUBLISHERS: '/publishers',
  PUBLISHER_BY_ID: (id) => `/publishers/${id}`,

  // Issues
  ISSUES: '/issues',
  ISSUE_BY_ID: (id) => `/issues/${id}`,
  RETURN_BOOK: (id) => `/issues/${id}/return`,

  // Fines
  FINES: '/fines',
  FINE_BY_ID: (id) => `/fines/${id}`,
  PAY_FINE: (id) => `/fines/${id}/pay`,
  WAIVE_FINE: (id) => `/fines/${id}/waive`,

  // Requests
  REQUESTS: '/requests',
  REQUEST_BY_ID: (id) => `/requests/${id}`,
  PROCESS_REQUEST: (id) => `/requests/${id}/process`,

  // Activity Logs
  ACTIVITY_LOGS: '/activity-logs',
  MY_ACTIVITY_LOGS: '/activity-logs/me',
  CLEANUP_LOGS: '/activity-logs/cleanup',
};

export default API_URLS;
