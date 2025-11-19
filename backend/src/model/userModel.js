import { pool } from "../config/db.js";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export async function createUser(userData) {
    const { name, email, password, role = 'athlete' } = userData
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS) 
    try {
        const query = `INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *`
        const values = [name, email, hashedPassword, role]
        const result = await pool.query(query, values)
        return result.rows[0]
    }
    catch (error) {
        console.error('Error creating user:', error)
        throw error
    }
}

export async function getUserByEmail(email) {
    const query = `SELECT * FROM users WHERE email = $1`
    const result = await pool.query(query, [email])
    return result.rows[0]
}

export async function getUserById(id) {
    const query = `SELECT * FROM users WHERE user_id = $1`
    const result = await pool.query(query, [id])
    return result.rows[0]
}

export const getAthletesForTrainer = async (trainerId) => {
    const query = `
      SELECT u.user_id, u.name, u.email, u.created_at
      FROM trainer_athletes ta
      JOIN users u ON ta.athlete_id = u.user_id
      WHERE ta.trainer_id = $1
    `;
    const { rows } = await pool.query(query, [trainerId]);
    return rows;
  };
  
export async function addAthleteToTrainer(trainerId, athleteId) {
    try {
        // Check if trainer exists and has 'trainer' role
        const trainerCheck = await pool.query(
            'SELECT role FROM users WHERE user_id = $1',
            [trainerId]
        )
        if (!trainerCheck.rows[0]) {
            throw new Error('Trainer not found')
        }
        if (trainerCheck.rows[0].role !== 'trainer') {
            throw new Error('User is not a trainer')
        }

        // Check if athlete exists and has 'athlete' role
        const athleteCheck = await pool.query(
            'SELECT role FROM users WHERE user_id = $1',
            [athleteId]
        )
        if (!athleteCheck.rows[0]) {
            throw new Error('Athlete not found')
        }
        if (athleteCheck.rows[0].role !== 'athlete') {
            throw new Error('User is not an athlete')
        }

        // Check if relationship already exists
        const existingRel = await pool.query(
            'SELECT * FROM trainer_athletes WHERE trainer_id = $1 AND athlete_id = $2',
            [trainerId, athleteId]
        )
        if (existingRel.rows.length > 0) {
            throw new Error('Athlete is already assigned to this trainer')
        }

        // Insert the relationship
        const query = `
            INSERT INTO trainer_athletes (trainer_id, athlete_id)
            VALUES ($1, $2)
            RETURNING *
        `
        const result = await pool.query(query, [trainerId, athleteId])
        return result.rows[0]
    } catch (error) {
        console.error("Error adding athlete to trainer:", error)
        throw error
    }
}

export const getUserByWorkoutId = async (workoutId) => {
    try {
        const query = `SELECT * FROM users WHERE user_id = $1`
        const result = await pool.query(query, [workoutId])
        return result.rows[0]
    }
    catch (error) {
        console.error('Error getting user by workout id:', error)
        throw error
    }
}