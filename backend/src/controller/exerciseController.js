import { addExerciseToWorkout, getExercisesByWorkoutId, updateExercise, deleteExercise } from '../model/exerciseModel.js'
import { getUserIdByWorkoutId } from '../model/workoutModel.js'
import { pool } from '../config/db.js'

export const addExerciseToWorkoutController = async (req, res) => {
    const userId = req.user.id
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
    
    const { workout_id, name, muscle_group, sets, reps, type } = req.body
    
    // Validate all required fields
    if (!workout_id || !name || !muscle_group || !sets || !reps || !type) {
        return res.status(400).json({ error: 'Missing required fields: workout_id, name, muscle_group, sets, reps, and type are required' })
    }
    
    try {
        // Verify workout exists and belongs to the authenticated user
        const workoutOwnerId = await getUserIdByWorkoutId(workout_id)
        if (userId !== workoutOwnerId) {
            return res.status(401).json({ error: 'Unauthorized: You do not own this workout' })
        }
        
        const exercise = await addExerciseToWorkout({ workout_id, name, muscle_group, sets, reps, type })
        res.status(201).json(exercise)
    }
    catch (error) {
        console.error('Error adding exercise to workout:', error)
        if (error.message === 'Workout not found') {
            return res.status(404).json({ error: 'Workout not found' })
        }
        res.status(500).json({ error: 'Failed to add exercise to workout', details: error.message })
    }
}

export const getExercisesByWorkoutIdController = async (req, res) => {
    const userId = req.user.id
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
    
    const { workout_id } = req.params
    
    // Validate workout_id is provided
    if (!workout_id) {
        return res.status(400).json({ error: 'Missing required parameter: workout_id' })
    }
    
    try {
        // Verify workout exists and belongs to the authenticated user
        const workoutOwnerId = await getUserIdByWorkoutId(workout_id)
        if (userId !== workoutOwnerId) {
            return res.status(401).json({ error: 'Unauthorized: You do not own this workout' })
        }
        
        const exercises = await getExercisesByWorkoutId(workout_id)
        res.status(200).json(exercises)
    }
    catch (error) {
        console.error('Error getting exercises by workout id:', error)
        if (error.message === 'Workout not found') {
            return res.status(404).json({ error: 'Workout not found' })
        }
        res.status(500).json({ error: 'Failed to get exercises by workout id', details: error.message })
    }
}

export const updateExerciseController = async (req, res) => {
    const userId = req.user.id
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
    
    const { exercise_id } = req.params
    const { name, muscle_group, sets, reps, type } = req.body
    
    // Validate exercise_id is provided
    if (!exercise_id) {
        return res.status(400).json({ error: 'Missing required parameter: exercise_id' })
    }
    
    // Validate at least one field to update is provided
    if (!name && !muscle_group && !sets && !reps && !type) {
        return res.status(400).json({ error: 'At least one field to update is required (name, muscle_group, sets, reps, or type)' })
    }
    
    try {
        // Get the workout_id for this exercise
        const exerciseQuery = await pool.query('SELECT workout_id FROM exercises WHERE exercise_id = $1', [exercise_id])
        if (!exerciseQuery.rows[0]) {
            return res.status(404).json({ error: 'Exercise not found' })
        }
        const workout_id = exerciseQuery.rows[0].workout_id
        
        // Verify the workout belongs to the authenticated user
        const workoutOwnerId = await getUserIdByWorkoutId(workout_id)
        if (userId !== workoutOwnerId) {
            return res.status(401).json({ error: 'Unauthorized: You do not own this exercise' })
        }
        
        const exercise = await updateExercise(exercise_id, { name, muscle_group, sets, reps, type })
        res.status(200).json(exercise)
    }
    catch (error) {
        console.error('Error updating exercise:', error)
        if (error.message === 'Workout not found') {
            return res.status(404).json({ error: 'Workout not found' })
        }
        res.status(500).json({ error: 'Failed to update exercise', details: error.message })
    }
}

export const deleteExerciseController = async (req, res) => {
    const userId = req.user.id
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
    
    const { exercise_id } = req.params
    
    // Validate exercise_id is provided
    if (!exercise_id) {
        return res.status(400).json({ error: 'Missing required parameter: exercise_id' })
    }
    
    try {
        // Get the workout_id for this exercise
        const exerciseQuery = await pool.query('SELECT workout_id FROM exercises WHERE exercise_id = $1', [exercise_id])
        if (!exerciseQuery.rows[0]) {
            return res.status(404).json({ error: 'Exercise not found' })
        }
        const workout_id = exerciseQuery.rows[0].workout_id
        
        // Verify the workout belongs to the authenticated user
        const workoutOwnerId = await getUserIdByWorkoutId(workout_id)
        if (userId !== workoutOwnerId) {
            return res.status(401).json({ error: 'Unauthorized: You do not own this exercise' })
        }
        
        const exercise = await deleteExercise(exercise_id)
        res.status(200).json(exercise)
    }
    catch (error) {
        console.error('Error deleting exercise:', error)
        if (error.message === 'Workout not found') {
            return res.status(404).json({ error: 'Workout not found' })
        }
        res.status(500).json({ error: 'Failed to delete exercise', details: error.message })
    }
}