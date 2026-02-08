import axiosInstance from '../config/axios';
import API_URLS from '../config/ApiUrl';

export const authorService = {
  getAll: async () => {
    const response = await axiosInstance.get(API_URLS.AUTHORS);
    return response.data;
  },

  create: async (authorData) => {
    const response = await axiosInstance.post(API_URLS.AUTHORS, authorData);
    return response.data;
  },

  update: async (id, authorData) => {
    const response = await axiosInstance.put(API_URLS.AUTHOR_BY_ID(id), authorData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(API_URLS.AUTHOR_BY_ID(id));
    return response.data;
  },
};

export default authorService;
