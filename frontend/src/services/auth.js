import apiClient from './apiClient';

export const loginUser = async (credentials) => {
  const response = await apiClient.post('/users/login', credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  // userData: { name, email, password }
  const response = await apiClient.post('/users', userData);
  return response.data;
};