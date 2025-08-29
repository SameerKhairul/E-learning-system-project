import express from 'express'
import { getMaterials, createAssignment, createExam, getAllCourses, getCertificate, getCourseId, updateEnrollment, getUpcomingDeadlines } from '../controllers/courseController.js'


const courseRouter = express.Router()

courseRouter.get('/all',getAllCourses)
courseRouter.get('/:id',getCourseId)
courseRouter.get('/materials/:id', getMaterials)
courseRouter.get('/get-certificate/:id/:userId',getCertificate)
courseRouter.get('/upcoming-deadlines/:userId',getUpcomingDeadlines)
courseRouter.post('/upload/:courseId',createExam)
courseRouter.post('/upload-assignment',createAssignment)
courseRouter.put('/update-enrollment/:userId',updateEnrollment)

export default courseRouter;