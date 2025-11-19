import apiClient from './apiClient';

export const loginUser = async (credentials) => {
  // credentials should look like: { email: '...', password: '...' }
  const response = await apiClient.post('/users/login', credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  // userData should look like: { username: '...', email: '...', password: '...' }
  const response = await apiClient.post('/users', userData);
  return response.data;
};