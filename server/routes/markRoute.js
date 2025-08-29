import express from 'express'
import { getCourseLeaderboard } from '../controllers/markController.js'

const markRouter = express.Router()

markRouter.get('/leaderboard/:courseId', getCourseLeaderboard)

export default markRouter;