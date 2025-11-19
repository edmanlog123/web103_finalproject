import express from 'express'
import { authenticateUser } from '../middleware/authenticateUser.js'
import {
  addExerciseToWorkoutController,
  getExercisesByWorkoutIdController,
  updateExerciseController,
  deleteExerciseController
} from '../controller/exerciseController.js'

const router = express.Router()

router.post('/', authenticateUser, addExerciseToWorkoutController)
router.get('/:workout_id', authenticateUser, getExercisesByWorkoutIdController)
router.patch('/:exercise_id', authenticateUser, updateExerciseController)
router.delete('/:exercise_id', authenticateUser, deleteExerciseController)

export default router

