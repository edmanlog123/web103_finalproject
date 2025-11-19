import { createWorkout, getWorkouts, getWorkoutByDate, updateWorkout, deleteWorkout } from '../model/workoutModel.js'
import { getUserIdByWorkoutId } from '../model/workoutModel.js'

export const createWorkoutController = async (req, res) => {
    const { date, is_completed, notes } = req.body
    const user_id = req.user.id
    if (!user_id) {
        return res.status(401).json({ error: 'Unauthorized' })
    }   
    try {
        const workout = await createWorkout({ user_id, date, is_completed, notes })
        if (!workout) {
            return res.status(400).json({ error: 'Failed to create workout' })
        }
        res.status(201).json(workout)
    }
    catch (error) {
        console.error('Error creating workout:', error)
        res.status(500).json({ error: 'Failed to create workout', details: error.message })
    }
}

export const getWorkoutsController = async (req, res) => {
    const userId = req.user.id
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
    try {
        const workouts = await getWorkouts(userId)
        res.status(200).json(workouts)
    }
    catch (error) {
        console.error('Error getting workouts:', error)
        res.status(500).json({ error: 'Failed to get workouts', details: error.message })
    }
}

export const getWorkoutByDateController = async (req, res) => {
    const userId = req.user.id
    const { date } = req.body
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
    try {
        const workout = await getWorkoutByDate(date, userId)
        res.status(200).json(workout)
    }
    catch (error) {
        console.error('Error getting workout by date:', error)
        res.status(500).json({ error: 'Failed to get workout by date', details: error.message })
    }
}

export const updateWorkoutController = async (req, res) => {
    const userId = req.user.id
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
    const { workoutId } = req.params 
    const { date, is_completed, notes } = req.body
    try {
        const user_id = await getUserIdByWorkoutId(workoutId)
        if (userId !== user_id) {
            return res.status(401).json({ error: 'Unauthorized' })
        }
        const workout = await updateWorkout(workoutId, { date, is_completed, notes })
        res.status(200).json(workout)
    }
    catch (error) {
        console.error('Error updating workout:', error)
        res.status(500).json({ error: 'Failed to update workout', details: error.message })
    }
}

export const deleteWorkoutController = async (req, res) => {
    const userId = req.user.id
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
    const { workoutId } = req.params
    
    try {
        const user_id = await getUserIdByWorkoutId(workoutId)
        if (userId !== user_id) {
            return res.status(401).json({ error: 'Unauthorized' })
        }
        const workout = await deleteWorkout(workoutId)
        res.status(200).json(workout)
    }
    catch (error) {
        console.error('Error deleting workout:', error)
        res.status(500).json({ error: 'Failed to delete workout', details: error.message })
    }
}