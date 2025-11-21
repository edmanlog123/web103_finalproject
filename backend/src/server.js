// backend/server.js
import express from 'express'
import cors from 'cors'
import 'dotenv/config'

// Import route files
import userRoutes from './routes/userRoute.js'
import workoutRoutes from './routes/workoutRoute.js'
import exerciseRoutes from './routes/exerciseRoute.js'
import progressRoutes from './routes/progressRoute.js'

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Enable CORS for frontend
app.use(cors({
  origin: 'http://localhost:5173', // Your Vite frontend URL
  credentials: true
}));

// Routes
app.use('/api/users', userRoutes)
app.use('/api/workouts', workoutRoutes)
app.use('/api/exercises', exerciseRoutes)
app.use('/api/progress', progressRoutes)

// Health check
app.get('/', (req, res) => {
  res.send('✅ API is running')
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`)
})
