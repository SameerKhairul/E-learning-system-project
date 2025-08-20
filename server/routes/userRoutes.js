import express from 'express'
import { getUserData, userEnrolledCourses, getUserCourseProgress, updateUserCourseProgress, addUserRating, purchaseCourse, getCompletedCourses } from '../controllers/userController.js'
import Stripe from "stripe"
const userRouter = express.Router()

userRouter.get('/data',getUserData)
userRouter.get('/enrolled-courses',userEnrolledCourses)
userRouter.post('/purchase', purchaseCourse)
userRouter.post('/update-course-progress',updateUserCourseProgress)
userRouter.post('/get-course-progress',getUserCourseProgress)
userRouter.post('/add-rating', addUserRating)
userRouter.get('/get-completed-courses/:userId',getCompletedCourses)


// //change shamsan part
// userRouter.post('/enroll', enrollCourse)

export default userRouter

