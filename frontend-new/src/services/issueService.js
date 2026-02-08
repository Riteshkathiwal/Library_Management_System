import axiosInstance from '../config/axios';
import API_URLS from '../config/ApiUrl';

export const issueService = {
  getAll: async (params = {}) => {
    const response = await axiosInstance.get(API_URLS.ISSUES, { params });
    return response.data;
  },

  issueBook: async (issueData) => {
    const response = await axiosInstance.post(API_URLS.ISSUES, issueData);
    return response.data;
  },

  returnBook: async (id) => {
    const response = await axiosInstance.put(API_URLS.RETURN_BOOK(id));
    return response.data;
  },
};

export default issueService;
