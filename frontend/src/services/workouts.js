import apiClient from './apiClient';

export const getAllWorkouts = async () => {
  const response = await apiClient.get('/workouts');
  return response.data;
};

export const createWorkout = async (workoutData) => {
  // workoutData: { date, notes, is_completed }
  const response = await apiClient.post('/workouts', workoutData);
  return response.data;
};

export const getWorkoutByDate = async (date) => {
  const response = await apiClient.get(`/workouts/${date}`);
  return response.data;
};

export const updateWorkout = async (id, workoutData) => {
  const response = await apiClient.patch(`/workouts/${id}`, workoutData);
  return response.data;
};

export const deleteWorkout = async (id) => {
  const response = await apiClient.delete(`/workouts/${id}`);
  return response.data;
};