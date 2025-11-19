import { pool } from "../config/db.js";

export async function trackTime(user_id) {
    try {
        const query = `SELECT MIN(date) as first_workout_date, MAX(date) as last_workout_date FROM workouts WHERE user_id = $1`
        const result = await pool.query(query, [user_id])
        
        // Handle case where user has no workouts
        if (!result.rows[0].first_workout_date || !result.rows[0].last_workout_date) {
            return { firstWorkoutDate: null, lastWorkoutDate: null }
        }
        
        return {
            firstWorkoutDate: result.rows[0].first_workout_date,
            lastWorkoutDate: result.rows[0].last_workout_date
        }
    }
    catch (error) {
        console.error('Error tracking time:', error)
        throw error
    }
}

export async function createProgress(progressData) {
    const { user_id, total_workouts, total_time, week_start } = progressData
    try {
        const query = `INSERT INTO progress (user_id, total_workouts, total_time, week_start) VALUES ($1, $2, $3, $4) RETURNING *`
        const values = [user_id, total_workouts, total_time, week_start]
        const result = await pool.query(query, values)
        return result.rows[0]
    }
    catch (error) {
        console.error('Error creating progress:', error)
        throw error
    }
}

export async function getProgressByUser(user_id) {
    try {
        const query = `SELECT * FROM progress WHERE user_id = $1 ORDER BY week_start DESC`
        const result = await pool.query(query, [user_id])
        return result.rows
    }
    catch (error) {
        console.error('Error getting progress by user:', error)
        throw error
    }
}

export async function updateProgress(progress_id, updates) {
    const { total_workouts, total_time } = updates
    try {
        const query = `UPDATE progress SET total_workouts = $1, total_time = $2 WHERE progress_id = $3 RETURNING *`
        const values = [total_workouts, total_time, progress_id]
        const result = await pool.query(query, values)
        return result.rows[0]
    }
    catch (error) {
        console.error('Error updating progress:', error)
        throw error
    }
}

