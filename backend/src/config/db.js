// backend/src/config/db.js
import 'dotenv/config'
import pkg from 'pg'

const { Pool } = pkg

// Create a connection pool
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }  // required for Neon
})

// Optional: simple test when the app starts
pool.connect()
  .then(client => {
    console.log('✅ Connected to Neon Postgres')
    client.release()  // Important: release the client back to the pool
  })
  .catch(err => console.error('❌ Database connection failed:', err))

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
})