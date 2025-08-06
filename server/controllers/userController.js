// import { CourseProgress } from "../models/courseProgress.js"
import User from "../models/User.js"
// import Course from "../models/Course.js"

export const getUserData = async( req,res) => {
    try {
        const userId = req.auth.userId
        const user = await User.findById(userId)

        if(!user){
            return res.json({success: false, message: 'User Not Found'})
        }

        res.json({success: true, user})
    } catch (error) {
        res.json({success: false, message: error.message})        
    }
}

// user enrolled courses with lec link

export const userEnrolledCourses = async (req,res)=> {
    try {
        const userId = req.auth.userId
        const userData = await User.findById(userId).populate('enrolledCourses')
        
        res.json({success: true, enrolledCourses: userData.enrolledCourses})
    } catch (error) {
        res.json({success: false,message: error.message})
        
    }
}

// //Update User Course Progress
// export const updateUserCourseProgress = async (req,res)=> {
//     try {
//         const userId = req.auth.userId
//         const {courseId, lectureId} = req.body

//         const progressData = await CourseProgress.findOne({userId, courseId})

//         if (progressData){
//             if (progressData.lectureCompleted.includes(lectureId)){
//                 return res.json({success: true, message: 'Lecture Already Completed'})
//             }

//             progressData.lectureCompleted.push(lectureId)
//             await progressData.save()
//         }else{
//             await CourseProgress.create({
//                 userId,
//                 courseId,
//                 lectureCompleted: [lectureId]
//             })
//         }
//         res.json({success: true, message: 'Progress Updated'})

//     } catch (error) {
//         res.json({success: false, message: error.message})
//     }
// }

// //get User course progress

// export const getUserCourseProgress = async (req,res)=>{
//     try {
//         const userId = req.auth.userId
//         const {courseId, lectureId} = req.body
//         const progressData = await CourseProgress.findOne({userId, courseId})

//         res.json({success:true, progressData})
        
//     } catch (error) {

//         res.json({success:false, message: error.message})
        
//     }
// }

// //Add User Rating to Course

// export const addUserRating = async (req, res)=> {
//     const userId = req.auth.userId;
//     const {courseId,rating} = req.body;

//     if(!courseId || !userId || !rating || rating < 1 || rating > 5){
//         return res.json({success: false, message: "Invalid Details"});
//     }

//     try {
//         const course = await Course.findById(courseId);
//         if (!course){
//             return res.json({success: false, message: "Course not found"});

//         }
//         const user = await User.findById(userId);

//         if (!user || !user.enrolledCourses.includes(courseId)){
//         return res.json({success: false, message: "User Has not purchased this course."});
//         }

//         const existingRatingIndex = course.courseRatings.findIndex(r => r.userId === userId)

//         if (existingRatingIndex > -1){
//             course.courseRatings[existingRatingIndex].rating = rating
//         }else{
//             course.courseRatings.push({userId,rating});

//         }
//         await course.save();

//         return res.json({success: true, message: 'Rating added'})
//     } catch (error) {
//         return res.json({success: false, message: error.message});
        
//     }
// }

//Enroll Course shamsan
export const enrollCourse = async (req, res) => {
    const userId = req.auth.userId;
    const { courseId } = req.body;

    if (!courseId || !userId) {
        return res.json({ success: false, message: "Invalid Details" });
    }

    try {
        const newpurchase = await Purchase.create({
            userId,
            courseId,
            status: 'completed'
        });
        await newpurchase.save();
        const user = await User.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        if (!user.enrolledCourses.includes(courseId)) {
            user.enrolledCourses.push(courseId);
            await user.save();
        }
        const course = await Course.findById(courseId);
        if (!course) {
            return res.json({ success: false, message: "Course not found" });
        }
        if (!course.enrolledUsers.includes(userId)) {
            course.enrolledUsers.push(userId);
            await course.save();
        }
        res.json({ success: true, message: "Course Enrolled Successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

//Update User Course Progress
export const updateUserCourseProgress = async (req,res)=> {
    try {
        const userId = req.auth.userId
        const {courseId, lectureId} = req.body

        const progressData = await CourseProgress.findOne({userId, courseId})

        if (progressData){
            if (progressData.lectureCompleted.includes(lectureId)){
                return res.json({success: true, message: 'Lecture Already Completed'})
            }

            progressData.lectureCompleted.push(lectureId)
            await progressData.save()
        }else{
            await CourseProgress.create({
                userId,
                courseId,
                lectureCompleted: [lectureId]
            })
        }
        res.json({success: true, message: 'Progress Updated'})

    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

//get User course progress

export const getUserCourseProgress = async (req,res)=>{
    try {
        const userId = req.auth.userId
        const {courseId, lectureId} = req.body
        const progressData = await CourseProgress.findOne({userId, courseId})

        res.json({success:true, progressData})
        
    } catch (error) {

        res.json({success:false, message: error.message})
        
    }
}

//Add User Rating to Course

export const addUserRating = async (req, res)=> {
    const userId = req.auth.userId;
    const {courseId,rating} = req.body;

    if(!courseId || !userId || !rating || rating < 1 || rating > 5){
        return res.json({success: false, message: "Invalid Details"});
    }

    try {
        const course = await Course.findById(courseId);
        if (!course){
            return res.json({success: false, message: "Course not found"});

        }
        const user = await User.findById(userId);

        if (!user || !user.enrolledCourses.includes(courseId)){
        return res.json({success: false, message: "User Has not purchased this course."});
        }

        const existingRatingIndex = course.courseRatings.findIndex(r => r.userId === userId)

        if (existingRatingIndex > -1){
            course.courseRatings[existingRatingIndex].rating = rating
        }else{
            course.courseRatings.push({userId,rating});

        }
        await course.save();

        return res.json({success: true, message: 'Rating added'})
    } catch (error) {
        return res.json({success: false, message: error.message});
        
    }
}