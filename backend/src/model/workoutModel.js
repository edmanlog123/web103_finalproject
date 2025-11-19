import { pool } from "../config/db.js";

export const createWorkout = async (workoutData) => {
    const { user_id, date, is_completed = false, notes= ''} = workoutData
    try {
        const query = `INSERT INTO workouts (user_id, date, is_completed, notes) VALUES ($1, $2, $3, $4) RETURNING *`
        const values = [user_id, date, is_completed, notes]
        const result = await pool.query(query, values)
        return result.rows[0]
    }
    catch (error) {
        console.error('Error creating workout:', error)
        throw error
    }
}

export const getWorkouts = async (userId) => {
    try {
        const query = `SELECT * FROM workouts WHERE user_id = $1`
        const result = await pool.query(query, [userId])
        return result.rows
    }
    catch (error) {
        console.error('Error getting workouts:', error)
        throw error
    }
}

export const getWorkoutByDate = async (date, userId) => {
    try {
        const query = `SELECT * FROM workouts WHERE date = $1 AND user_id = $2`
        const result = await pool.query(query, [date, userId])
        return result.rows[0]
    }
    catch (error) {
        console.error('Error getting workout by date:', error)
        throw error
    }
}

export const updateWorkout = async (workoutId, workoutData) => {
    const { date, is_completed, notes } = workoutData
    try {
        const query = `UPDATE workouts SET date = $1, is_completed = $2, notes = $3 WHERE workout_id = $4`
        const values = [date, is_completed, notes, workoutId]
        const result = await pool.query(query, values)
        return result.rows[0]
    }
    catch (error) {
        console.error('Error updating workout:', error)
        throw error
    }
}

export const deleteWorkout = async (workoutId) => {
    try {
        const query = `DELETE FROM workouts WHERE workout_id = $1 RETURNING *`
        const result = await pool.query(query, [workoutId])
        return result.rows[0]
    }
    catch (error) {
        console.error('Error deleting workout:', error)
        throw error
    }
}

export const getUserIdByWorkoutId = async (workoutId) => {
    try {
        const query = `SELECT user_id FROM workouts WHERE workout_id = $1`
        const result = await pool.query(query, [workoutId])
        if (!result.rows[0]) {
            throw new Error('Workout not found')
        }
        return result.rows[0].user_id
    }
    catch (error) {
        console.error('Error getting user id by workout id:', error)
        throw error
    }
}