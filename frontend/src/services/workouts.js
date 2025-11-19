import apiClient from './apiClient';

export const getAllWorkouts = async () => {
  const response = await apiClient.get('/workouts');
  return response.data;
};

export const createWorkout = async (workoutData) => {
  const response = await apiClient.post('/workouts', workoutData);
  return response.data;
};

export const getWorkoutById = async (id) => {
  const response = await apiClient.get('/workouts');
  // Helper to find the specific workout from the list
  return response.data.find(workout => workout.workout_id === parseInt(id));
};

export const updateWorkout = async (id, workoutData) => {
  const response = await apiClient.patch(`/workouts/${id}`, workoutData);
  return response.data;
};

export const deleteWorkout = async (id) => {
  const response = await apiClient.delete(`/workouts/${id}`);
  return response.data;
};