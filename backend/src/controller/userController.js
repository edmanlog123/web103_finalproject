import { createUser, getUserByEmail, getUserById, getAthletesForTrainer, addAthleteToTrainer} from '../model/userModel.js';

export const createUserController = async (req, res) => {
    const { name, email, password, role } = req.body
    
    // Validate required fields
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields: name, email, and password are required' })
    }
    
    // Validate role if provided
    if (role && !['trainer', 'athlete'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role. Must be "trainer" or "athlete"' })
    }
    
    try {
        const user = await createUser({ name, email, password, role })
        // Remove password_hash before sending response
        const { password_hash, ...safeUser } = user
        res.status(201).json(safeUser)
    }
    catch (error) {
        console.error("User creation error:", error)
        res.status(500).json({ error: 'Failed to create user', details: error.message })
    }
}

export const getUserByEmailController = async (req, res) => {
    const { email } = req.params
    try {
        const user = await getUserByEmail(email)
        if (!user){
            return res.status(404).json({ error: 'User not found' })
        }
        // Remove password_hash before sending response
        const { password_hash, ...safeUser } = user
        res.status(200).json(safeUser)
    }
    catch (error) {
        console.error("User email retrieval error:", error)
        res.status(500).json({ error: 'Failed to get user by email', details: error.message })
    }
}

export const getUserByIdController = async (req, res) => {
    const { id } = req.user
    try {
        const user = await getUserById(id)
        if (!user){
            return res.status(404).json({ error: 'User not found' })
        }
        // Remove password_hash before sending response
        const { password_hash, ...safeUser } = user
        res.status(200).json(safeUser)
    }
    catch (error) {
        console.error("User ID retrieval error:", error)
        res.status(500).json({ error: 'Failed to get user by id', details: error.message })
    }
}

export const getAthletesForTrainerController = async (req, res) => {
    // Check if user is a trainer
    if (req.user.role !== 'trainer') {
        return res.status(403).json({ error: 'Only trainers can view their athletes' })
    }
    
    const trainerId = req.user.id
    try {
        const athletes = await getAthletesForTrainer(trainerId)
        if (!athletes || athletes.length === 0) {
            return res.status(404).json({ error: 'No athletes found for this trainer' })
        }
        res.status(200).json(athletes)
    }
    catch (error) {
        console.error("Get athletes error:", error)
        res.status(500).json({ error: 'Failed to get athletes for trainer', details: error.message })
    }
}

export const addAthleteToTrainerController = async (req, res) => {
    // Check if user is a trainer
    if (req.user.role !== 'trainer') {
        return res.status(403).json({ error: 'Only trainers can add athletes' })
    }

    const trainerId = req.user.id
    const athleteId = parseInt(req.body.athleteId, 10)

    // Validation
    if (!athleteId || isNaN(athleteId)) {
        return res.status(400).json({ error: 'Invalid or missing athleteId' })
    }

    if (trainerId === athleteId) {
        return res.status(400).json({ error: 'Trainers cannot add themselves as athletes' })
    }

    try {
        const relationship = await addAthleteToTrainer(trainerId, athleteId)
        res.status(201).json(relationship)
    } catch (error) {
        console.error("Error adding athlete to trainer:", error)
        res.status(500).json({ error: 'Failed to add athlete to trainer', details: error.message })
    }
}
