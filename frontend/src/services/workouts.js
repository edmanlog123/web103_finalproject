import apiClient from './apiClient';

export const getAllWorkouts = async () => {
  const response = await apiClient.get('/workouts');
  return response.data;
};

export const getWorkoutById = async (id) => {
  // Since the backend might not have a direct GET /workouts/:id, 
  // we filter from all workouts (common pattern for small apps)
  const response = await apiClient.get('/workouts');
  return response.data.find(w => w.workout_id === parseInt(id));
};

export const createWorkout = async (data) => {
  const response = await apiClient.post('/workouts', data);
  return response.data;
};

export const updateWorkout = async (id, data) => {
  const response = await apiClient.patch(`/workouts/${id}`, data);
  return response.data;
};

export const deleteWorkout = async (id) => {
  const response = await apiClient.delete(`/workouts/${id}`);
  return response.data;
};