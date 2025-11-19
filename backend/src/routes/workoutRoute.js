import express from 'express'
import { authenticateUser } from '../middleware/authenticateUser.js'
import {
  createWorkoutController,
  getWorkoutsController,
  getWorkoutByDateController,
  updateWorkoutController,
  deleteWorkoutController
} from '../controller/workoutController.js'

const router = express.Router()

router.post('/', authenticateUser, createWorkoutController)
router.get('/', authenticateUser, getWorkoutsController)
router.get('/:date', authenticateUser, getWorkoutByDateController)
router.patch('/:workoutId', authenticateUser, updateWorkoutController)
router.delete('/:workoutId', authenticateUser, deleteWorkoutController)

export default router
