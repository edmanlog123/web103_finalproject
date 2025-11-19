import express from 'express'
import { authenticateUser } from '../middleware/authenticateUser.js'
import {
  createUserController,
  getUserByEmailController,
  getUserByIdController,
  getAthletesForTrainerController,
  addAthleteToTrainerController
} from '../controller/userController.js'
import { loginController } from '../controller/authController.js'

const router = express.Router()

// Unprotected routes (for registration and login verification)
router.post('/', createUserController)
router.post('/login', loginController)
router.get('/:email', getUserByEmailController)

// Protected routes (require authentication)
router.get('/me/profile', authenticateUser, getUserByIdController)
router.get('/me/athletes', authenticateUser, getAthletesForTrainerController)
router.post('/me/athletes', authenticateUser, addAthleteToTrainerController)

export default router

