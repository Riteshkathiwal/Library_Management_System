import axiosInstance from '../config/axios';
import API_URLS from '../config/ApiUrl';

export const roleService = {
  getAll: async () => {
    const response = await axiosInstance.get(API_URLS.ROLES);
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(API_URLS.ROLE_BY_ID(id));
    return response.data;
  },

  create: async (roleData) => {
    const response = await axiosInstance.post(API_URLS.ROLES, roleData);
    return response.data;
  },

  update: async (id, roleData) => {
    const response = await axiosInstance.put(API_URLS.ROLE_BY_ID(id), roleData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(API_URLS.ROLE_BY_ID(id));
    return response.data;
  },
};

export default roleService;
