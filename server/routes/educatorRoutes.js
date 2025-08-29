import express from 'express'
import { updateRoleToEducator, addCourse,  educatorDashboardData, getEnrolledStudentsData, getEducatorCourses, postReview, getReview } from '../controllers/educatorController.js';
import { protectEducator } from '../middlewares/authMiddleware.js'
import upload from '../configs/multer.js'

const educatorRouter = express.Router()



educatorRouter.get('/update-role', updateRoleToEducator)
educatorRouter.post('/add-course', upload.fields([{name:'image'}, {name:'pdf'}]), protectEducator, addCourse)
educatorRouter.get('/get-educator-course/:userId',getEducatorCourses)
educatorRouter.get('/dashboard', protectEducator,educatorDashboardData)
educatorRouter.get('/enrolled-students', protectEducator,getEnrolledStudentsData)
educatorRouter.post('/post-review',postReview)
educatorRouter.get('/get-review/:courseId',getReview)

export default educatorRouter;