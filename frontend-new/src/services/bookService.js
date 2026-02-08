import axiosInstance from '../config/axios';
import API_URLS from '../config/ApiUrl';

export const bookService = {
  getAll: async (params = {}) => {
    const response = await axiosInstance.get(API_URLS.BOOKS, { params });
    // API returns { success: true, count: N, data: [...] }
    return response.data.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(API_URLS.BOOK_BY_ID(id));
    return response.data;
  },

  create: async (bookData) => {
    const response = await axiosInstance.post(API_URLS.BOOKS, bookData);
    return response.data;
  },

  update: async (id, bookData) => {
    const response = await axiosInstance.put(API_URLS.BOOK_BY_ID(id), bookData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(API_URLS.BOOK_BY_ID(id));
    return response.data;
  },
};

export default bookService;
