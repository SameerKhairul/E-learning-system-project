import { CourseProgress } from "../models/CourseProgress.js"
import Course from "../models/Course.js"
import User from "../models/User.js"
import { Marks } from "../models/Mark.js"
import { Purchase } from "../models/Purchase.js"
import Stripe from "stripe"
import { clerkClient } from '@clerk/express'

export const getUserData = async( req,res) => {
    try {
        const userId = req.auth.userId
        let user = await User.findById(userId)

        if(!user){
            // If user doesn't exist, create one from Clerk data
            try {
                const clerkUser = await clerkClient.users.getUser(userId)
                const userData = {
                    _id: clerkUser.id,
                    email: clerkUser.emailAddresses[0].emailAddress,
                    name: clerkUser.firstName + " " + clerkUser.lastName,
                    imageUrl: clerkUser.imageUrl,
                }
                user = await User.create(userData)
            } catch (clerkError) {
                return res.json({success: false, message: 'User Not Found'})
            }
        }

        res.json({success: true, user})
    } catch (error) {
        res.json({success: false, message: error.message})        
    }
}



export const userEnrolledCourses = async (req,res)=> {
    try {
        const userId = req.auth.userId
        let userData = await User.findById(userId).populate('enrolledCourses')
        
        if(!userData){
            // If user doesn't exist, create one from Clerk data
            try {
                const clerkUser = await clerkClient.users.getUser(userId)
                const newUserData = {
                    _id: clerkUser.id,
                    email: clerkUser.emailAddresses[0].emailAddress,
                    name: clerkUser.firstName + " " + clerkUser.lastName,
                    imageUrl: clerkUser.imageUrl,
                }
                userData = await User.create(newUserData)
            } catch (clerkError) {
                return res.json({success: false, message: 'User Not Found'})
            }
        }
        
        res.json({success: true, enrolledCourses: userData.enrolledCourses})
    } catch (error) {
        res.json({success: false,message: error.message})
        
    }
}


// //Enroll Course shamsan
// export const enrollCourse = async (req, res) => {
//     const userId = req.auth.userId;
//     const { courseId } = req.body;

//     if (!courseId || !userId) {
//         return res.json({ success: false, message: "Invalid Details" });
//     }

//     try {
//         const newpurchase = await Purchase.create({
//             userId,
//             courseId,
//             status: 'completed'
//         });
//         await newpurchase.save();
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.json({ success: false, message: "User not found" });
//         }
//         if (!user.enrolledCourses.includes(courseId)) {
//             user.enrolledCourses.push(courseId);
//             await user.save();
//         }
//         const course = await Course.findById(courseId);
//         if (!course) {
//             return res.json({ success: false, message: "Course not found" });
//         }
//         if (!course.enrolledUsers.includes(userId)) {
//             course.enrolledUsers.push(userId);
//             await course.save();
//         }
//         res.json({ success: true, message: "Course Enrolled Successfully" });
//     } catch (error) {
//         res.json({ success: false, message: error.message });
//     }
// }

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
        let user = await User.findById(userId);

        if (!user) {
            // If user doesn't exist, create one from Clerk data
            try {
                const clerkUser = await clerkClient.users.getUser(userId)
                const newUserData = {
                    _id: clerkUser.id,
                    email: clerkUser.emailAddresses[0].emailAddress,
                    name: clerkUser.firstName + " " + clerkUser.lastName,
                    imageUrl: clerkUser.imageUrl,
                }
                user = await User.create(newUserData)
            } catch (clerkError) {
                return res.json({success: false, message: 'User Not Found'})
            }
        }

        if (!user.enrolledCourses.includes(courseId)){
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

//Purchase Course

export const purchaseCourse = async (req, res) => {
    try {
        const { courseId } = req.body
        const {  origin } = req.headers
        const userId = req.auth.userId
        let userData = await User.findById(userId)
        const courseData = await Course.findById(courseId)

        if(!userData) {
            // create one from Clerk data if no user
            try {
                const clerkUser = await clerkClient.users.getUser(userId)
                const newUserData = {
                    _id: clerkUser.id,
                    email: clerkUser.emailAddresses[0].emailAddress,
                    name: clerkUser.firstName + " " + clerkUser.lastName,
                    imageUrl: clerkUser.imageUrl,
                }
                userData = await User.create(newUserData)
            } catch (clerkError) {
                return res.json({success: false, message: 'User Not Found'})
            }
        }

        if(!courseData) {
            return res.json({success: false, message: 'Course not found'})
        }

        const purchaseData = {
            courseId: courseData._id,
            userId,
            amount: (courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2),
        }

        const newPurchase = await Purchase.create(purchaseData)
        console.log('Created new purchase:', {
            id: newPurchase._id,
            userId: newPurchase.userId,
            courseId: newPurchase.courseId,
            amount: newPurchase.amount,
            status: newPurchase.status
        });
        
        const markData = {
            courseId: courseData._id,
            userId,
            marks: [],
        }
        const newMarks = await Marks.create(markData);

        //Stripe gateway initialize
        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)
        const currency = process.env.CURRENCY.toLowerCase()

        //create line items to for Stripe
        const line_items = [{
            price_data:{
                currency,
                product_data: {
                    name: courseData.courseTitle
                }, 
                unit_amount: Math.floor(newPurchase.amount)*100
            },
            quantity: 1
        }]

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-enrollments`,
            cancel_url: `${origin}/`,
            line_items: line_items,
            mode: 'payment',
            metadata: {
                purchaseId: newPurchase._id.toString()
            }
        })

        console.log('Created Stripe session:', {
            sessionId: session.id,
            purchaseId: newPurchase._id.toString(),
            sessionUrl: session.url
        });

        res.json({success: true, session_url: session.url})

    } catch (error) {
        res.json({success: false, message: error.message});
    }
}






export const getCompletedCourses = async (req, res) => {
  try {
    const { userId } = req.params; 
    
    
    const completedProgress = await CourseProgress.find({
      userId,
      completed: true
    }).select('courseId');

    if (!completedProgress.length) {
      return res.status(200).json({ courses: [] });
    }

    // 2. Extract course IDs
    const courseIds = completedProgress.map(p => p.courseId);

    // 3. Find course details
    const completedCourses = await Course.find({ _id: { $in: courseIds } });

    // 4. Return result
    res.status(200).json({ courses: completedCourses });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};




