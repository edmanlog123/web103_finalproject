import { pool } from './src/config/db.js'
import 'dotenv/config'

// Create Users Table - matches ERD
const createUsersQuery = `
  CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) CHECK (role IN ('trainer', 'athlete')),
    created_at TIMESTAMP DEFAULT NOW()
  )
`

// Create Workouts Table - matches ERD
const createWorkoutsQuery = `
  CREATE TABLE IF NOT EXISTS workouts (
    workout_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id),
    date DATE,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    notes TEXT
  )
`

// Create Exercises Table - matches ERD
const createExercisesQuery = `
  CREATE TABLE IF NOT EXISTS exercises (
    exercise_id SERIAL PRIMARY KEY,
    workout_id INT NOT NULL REFERENCES workouts(workout_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    muscle_group VARCHAR(50),
    sets INT,
    reps INT,
    type VARCHAR(20) CHECK (type IN ('warmup', 'working'))
  )
`

// Create Trainer_Athletes Table - matches ERD
const createTrainerAthletesQuery = `
  CREATE TABLE IF NOT EXISTS trainer_athletes (
    id SERIAL PRIMARY KEY,
    trainer_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    athlete_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW()
  )
`

// Create Progress Table - additional table for tracking user progress
const createProgressQuery = `
  CREATE TABLE IF NOT EXISTS progress (
    progress_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id),
    week_start DATE NOT NULL,
    total_workouts INT DEFAULT 0,
    total_time INTERVAL
  )
`

// Reset database function - drops existing tables and creates fresh ones
const resetDatabase = async () => {
  try {
    console.log('🔄 Starting database reset...')
    
    // Create tables in proper dependency order
    await pool.query(createUsersQuery)
    console.log('✅ Created users table')
    
    await pool.query(createWorkoutsQuery)
    console.log('✅ Created workouts table')
    
    await pool.query(createExercisesQuery)
    console.log('✅ Created exercises table')
    
    await pool.query(createTrainerAthletesQuery)
    console.log('✅ Created trainer_athletes table')
    
    await pool.query(createProgressQuery)
    console.log('✅ Created progress table')
    
    console.log('🎉 Database reset complete!')
    
  } catch (error) {
    console.error('❌ Error resetting database:', error)
    throw error
  }
}

resetDatabase()