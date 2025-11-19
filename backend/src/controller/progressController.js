import { trackTime, createProgress, getProgressByUser } from '../model/progressModel.js'
import { pool } from '../config/db.js'

export const createProgressController = async (req, res) => {
    const userId = req.user.id
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
    
    try {
        // Call trackTime to get first and last workout dates
        const { firstWorkoutDate, lastWorkoutDate } = await trackTime(userId)
        
        // Check if user has any workouts
        if (!firstWorkoutDate || !lastWorkoutDate) {
            return res.status(404).json({ error: 'No workouts found for this user' })
        }
        
        // Calculate total_time: difference in days between first and last workout
        const firstDate = new Date(firstWorkoutDate)
        const lastDate = new Date(lastWorkoutDate)
        const total_time = Math.floor((lastDate - firstDate) / (1000 * 60 * 60 * 24))
        
        // Calculate week_start: start of week (Monday) based on lastWorkoutDate
        const lastDateObj = new Date(lastWorkoutDate)
        const dayOfWeek = lastDateObj.getDay() // 0 = Sunday, 1 = Monday, etc.
        const daysFromMonday = (dayOfWeek === 0) ? 6 : dayOfWeek - 1 // Convert Sunday to 6, others to days from Monday
        const week_start = new Date(lastDateObj)
        week_start.setDate(lastDateObj.getDate() - daysFromMonday)
        
        // Query to count total workouts for the user
        const workoutCountQuery = await pool.query('SELECT COUNT(*) FROM workouts WHERE user_id = $1', [userId])
        const total_workouts = parseInt(workoutCountQuery.rows[0].count, 10)
        
        // Create progress record
        const progress = await createProgress({
            user_id: userId,
            total_workouts,
            total_time,
            week_start: week_start.toISOString().split('T')[0] // Format as YYYY-MM-DD
        })
        
        res.status(201).json(progress)
    }
    catch (error) {
        console.error('Error creating progress:', error)
        res.status(500).json({ error: 'Failed to create progress', details: error.message })
    }
}

export const getProgressController = async (req, res) => {
    const userId = req.user.id
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' })
    }
    
    try {
        const progressRecords = await getProgressByUser(userId)
        
        if (!progressRecords || progressRecords.length === 0) {
            return res.status(404).json({ error: 'No progress records found for this user' })
        }
        
        res.status(200).json(progressRecords)
    }
    catch (error) {
        console.error('Error getting progress:', error)
        res.status(500).json({ error: 'Failed to get progress', details: error.message })
    }
}

