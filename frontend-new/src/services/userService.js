import axiosInstance from '../config/axios';
import API_URLS from '../config/ApiUrl';

export const userService = {
  getAll: async () => {
    const response = await axiosInstance.get(API_URLS.USERS);
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(API_URLS.USER_BY_ID(id));
    return response.data;
  },

  create: async (userData) => {
    const response = await axiosInstance.post(API_URLS.USERS, userData);
    return response.data;
  },

  update: async (id, userData) => {
    const response = await axiosInstance.put(API_URLS.USER_BY_ID(id), userData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(API_URLS.USER_BY_ID(id));
    return response.data;
  },
};

export default userService;
