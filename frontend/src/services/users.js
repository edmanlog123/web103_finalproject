import apiClient from './apiClient';

export const getUserProfile = async () => {
  // Fetches the logged-in user's profile
  const response = await apiClient.get('/users/me/profile');
  return response.data;
};

export const getUserByEmail = async (email) => {
  const response = await apiClient.get(`/users/${email}`);
  return response.data;
};

export const getAthletes = async () => {
  const response = await apiClient.get('/users/me/athletes');
  return response.data;
};

export const addAthlete = async (athleteData) => {
  const response = await apiClient.post('/users/me/athletes', athleteData);
  return response.data;
};