import express from 'express'
import { authenticateUser } from '../middleware/authenticateUser.js'
import {
  createProgressController,
  getProgressController
} from '../controller/progressController.js'

const router = express.Router()

router.post('/', authenticateUser, createProgressController)
router.get('/', authenticateUser, getProgressController)

export default router

