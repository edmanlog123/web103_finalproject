import { pool } from "../config/db.js";

export async function addExerciseToWorkout (exerciseData) {
    const { workout_id, name, muscle_group, sets, reps, type } = exerciseData
    try {
        const query = `INSERT INTO exercises (workout_id, name, muscle_group, sets, reps, type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`
        const values = [workout_id, name, muscle_group, sets, reps, type]
        const result = await pool.query(query, values)
        return result.rows[0]
    }   
    catch (error) {
        console.error('Error adding exercise to workout:', error)
        throw error
    }
}

export async function getExercisesByWorkoutId(workout_id) {
    try {
        
        const query = `SELECT * FROM exercises WHERE workout_id = $1`
        const result = await pool.query(query, [workout_id])
        return result.rows
    }
    catch (error) {
        console.error('Error getting exercises by workout id:', error)
        throw error
    }
}

export async function updateExercise(exercise_id, exerciseData) {
    const { name, muscle_group, sets, reps, type } = exerciseData
    try {
        const query = `UPDATE exercises SET name = $1, muscle_group = $2, sets = $3, reps = $4, type = $5 WHERE exercise_id = $6`
        const values = [name, muscle_group, sets, reps, type, exercise_id]
        const result = await pool.query(query, values)
        return result.rows[0]
    }
    catch (error) {
        console.error('Error updating exercise:', error)
        throw error
    }
}

export async function deleteExercise(exercise_id) {
    try {
        const query = `DELETE FROM exercises WHERE exercise_id = $1 RETURNING *`
        const result = await pool.query(query, [exercise_id])
        return result.rows[0]
    }
    catch (error) {
        console.error('Error deleting exercise:', error)
        throw error
    }
}