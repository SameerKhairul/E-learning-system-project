import { clerkClient } from '@clerk/express'
import Course from '../models/Course.js'
import {v2 as cloudinary} from 'cloudinary'
import { Purchase } from '../models/Purchase.js'
import User from '../models/User.js'
import  Review from '../models/Review.js'
import StudyMaterial from '../models/studyMaterials.js'
//update role to educator

export  const updateRoleToEducator = async (req,res)=>{
    try {
        const userId = req.auth.userId

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata:{
                role: 'educator',
            }
        })

        res.json({success: true, message: 'You have the instructor role now'})
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
//ADD course

export const addCourse = async (req,res)=> {
    try {
        const {courseData} = req.body
        const imageFile = req.files.image[0]
        const pdfFile = req.files.pdf[0]
        const educatorId = req.auth.userId

        if (!imageFile){
            return res.json({ success: false, message: 'Thumbnail not Attached '})
        }
        const parsedCourseData = await JSON.parse(courseData)
        parsedCourseData.educator = educatorId
        const newCourse = await Course.create(parsedCourseData)
        const imageUpload = await cloudinary.uploader.upload(imageFile.path)
        newCourse.courseThumbnail = imageUpload.secure_url
        await newCourse.save()

       if (pdfFile) {
        const pdfUpload = await cloudinary.uploader.upload(pdfFile.path, {
        resource_type: 'raw', // ensures PDF is treated as file
       });

       await StudyMaterial.create({
        courseId: newCourse._id,
        fileUrl: pdfUpload.secure_url,
       });
        }
        res.json({ success: true, message: "Course Added"})
    } catch (error){
        res.json({ success: false, message: error.message})
    }
}



export const getEducatorCourses = async (req, res) => {
  try {
    const { userId } = req.params; 

    if (!userId) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    const courses = await Course.find({ educator: userId }); 

    res.status(200).json({ success: true, courses });
  } catch (error) {
    console.error("Error fetching educator courses:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};







export const educatorDashboardData = async (req,res)=>{
    try {
      const educator = req.auth.userId
      const courses = await Course.find({educator})
      const totalCourses = courses.length
      
      const courseIds = courses.map(course => course._id);

      //Calculate total earnings\
        const purchases = await Purchase.find({
            courseId: {$in: courseIds},
            status: 'completed'
        });

        const totalEarnings = purchases.reduce((sum,purchase) => sum + purchase.amount,0);

        //collect unique student
        const enrolledStudentsData = [];
        for(const course of courses){
            const students = await User.find({
                _id: {$in: course.enrolledStudents}
            }, 'name imageUrl');
            
            students.forEach(student => {
                enrolledStudentsData.push({
                    courseTitle: course.courseTitle,
                    student 
                });
                
            });
        }
        res.json({success:true,dashboardData: {
            totalEarnings, enrolledStudentsData,totalCourses
        }})

    } catch (error) {
        res.json({success: false, message: error.message});
        
    }
}
// Enrolled students data.

export const getEnrolledStudentsData = async (req,res)=> {
    try {
        const educator = req.auth.userId;
        
        if (!educator) {
            return res.status(401).json({success: false, message: 'Educator not authenticated'});
        }

        const courses = await Course.find({educator});
        const courseIds = courses.map(course => course._id);
        
        if (courseIds.length === 0) {
            return res.json({ success: true, enrolledStudents: []});
        }
        
        const purchases = await Purchase.find({
            courseId: { $in: courseIds},
            status: 'completed'
        }).populate('userId','name imageUrl').populate('courseId', 'courseTitle')

        const enrolledStudents = purchases
            .filter(purchase => purchase.userId && purchase.courseId)
            .map(purchase => ({
                student: purchase.userId,
                courseTitle: purchase.courseId?.courseTitle || 'Unknown Course',
                purchaseDate: purchase.createdAt
            }));

        res.json({ success: true, enrolledStudents})

    } catch (error) {
        console.error('Error in getEnrolledStudentsData:', error);
        res.status(500).json({success: false, message: error.message || 'Internal server error'});
        
    }
}



export const postReview = async(req,res)=>{
    try{
        const {newReview, educatorId, userName, courseId} = req.body;
        
        if (!courseId) {
            return res.status(400).json({success: false, message: "Course ID is required"});
        }
        
        await Review.create({
            educatorId,
            courseId,
            review: newReview,
            userName
        });

        res.status(201).json({success: true, message: "Review posted successfully"});
        
    }catch(error){
        console.log(error);
        res.status(500).json({success: false, message: "Internal Server Error"});
    }
}

export const getReview = async(req,res)=>{
    try{
        const {courseId} = req.params;
        
        if (!courseId) {
            return res.status(400).json({success: false, message: "Course ID is required"});
        }
        
        const data = await Review.find({courseId}).sort({createdAt: -1});
        res.status(200).json({success: true, reviews: data});
        
    }catch(error){
        console.log(error);
        res.status(500).json({success: false, message: "Internal Server Error"});
    }
}