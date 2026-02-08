export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

export const validateISBN = (isbn) => {
  const isbnRegex = /^(?:\d{10}|\d{13})$/;
  return isbnRegex.test(isbn.replace(/-/g, ''));
};

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== '';
};

export const validateMinLength = (value, minLength) => {
  return value && value.length >= minLength;
};

export const validateMaxLength = (value, maxLength) => {
  return value && value.length <= maxLength;
};

export const validateNumber = (value) => {
  return !isNaN(value) && value !== '';
};

export const validatePositiveNumber = (value) => {
  return validateNumber(value) && parseFloat(value) > 0;
};

export const validateYear = (year) => {
  const currentYear = new Date().getFullYear();
  return validateNumber(year) && year >= 1000 && year <= currentYear;
};

export const formValidator = {
  user: (data) => {
    const errors = {};

    if (!validateRequired(data.name)) {
      errors.name = 'Name is required';
    } else if (!validateMinLength(data.name, 2)) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!validateRequired(data.email)) {
      errors.email = 'Email is required';
    } else if (!validateEmail(data.email)) {
      errors.email = 'Invalid email format';
    }

    if (data.password && !validateMinLength(data.password, 6)) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!validateRequired(data.mobile)) {
      errors.mobile = 'Mobile number is required';
    } else if (!validatePhone(data.mobile)) {
      errors.mobile = 'Mobile number must be 10 digits';
    }

    return errors;
  },

  book: (data) => {
    const errors = {};

    if (!validateRequired(data.title)) {
      errors.title = 'Title is required';
    }

    if (!validateRequired(data.isbn)) {
      errors.isbn = 'ISBN is required';
    } else if (!validateISBN(data.isbn)) {
      errors.isbn = 'Invalid ISBN format (10 or 13 digits)';
    }

    if (!validateRequired(data.author_id)) {
      errors.author_id = 'Author is required';
    }

    if (!validateRequired(data.category_id)) {
      errors.category_id = 'Category is required';
    }

    if (!validateRequired(data.publisher_id)) {
      errors.publisher_id = 'Publisher is required';
    }

    if (!validateRequired(data.quantity)) {
      errors.quantity = 'Quantity is required';
    } else if (!validatePositiveNumber(data.quantity)) {
      errors.quantity = 'Quantity must be a positive number';
    }

    if (data.publication_year && !validateYear(data.publication_year)) {
      errors.publication_year = 'Invalid publication year';
    }

    return errors;
  },

  author: (data) => {
    const errors = {};

    if (!validateRequired(data.name)) {
      errors.name = 'Author name is required';
    } else if (!validateMinLength(data.name, 2)) {
      errors.name = 'Name must be at least 2 characters';
    }

    return errors;
  },

  category: (data) => {
    const errors = {};

    if (!validateRequired(data.name)) {
      errors.name = 'Category name is required';
    } else if (!validateMinLength(data.name, 2)) {
      errors.name = 'Name must be at least 2 characters';
    }

    return errors;
  },

  publisher: (data) => {
    const errors = {};

    if (!validateRequired(data.name)) {
      errors.name = 'Publisher name is required';
    } else if (!validateMinLength(data.name, 2)) {
      errors.name = 'Name must be at least 2 characters';
    }

    return errors;
  },

  role: (data) => {
    const errors = {};

    if (!validateRequired(data.role_name)) {
      errors.role_name = 'Role name is required';
    } else if (!validateMinLength(data.role_name, 2)) {
      errors.role_name = 'Role name must be at least 2 characters';
    }

    if (!data.permissions || data.permissions.length === 0) {
      errors.permissions = 'At least one permission is required';
    }

    return errors;
  },

  issue: (data) => {
    const errors = {};

    if (!validateRequired(data.member_id)) {
      errors.member_id = 'Member is required';
    }

    if (!validateRequired(data.book_id)) {
      errors.book_id = 'Book is required';
    }

    return errors;
  },
};

export default formValidator;
