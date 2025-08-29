import Course from "../models/Course.js";
import User from '../models/User.js';
import Exam from "../models/Exam.js"
import CourseProgress from '../models/CourseProgress.js'
import Assignment from '../models/assignment.js'
import { Purchase } from '../models/Purchase.js'
import { Marks } from '../models/Mark.js'
import StudyMaterial from "../models/studyMaterials.js";
//olaki

export const  getAllCourses = async( req,res) => {
    try {
        const courses = await Course.find({isPublished: true}).select(['-courseContent', '-enrolledStudents']).populate
        ({path:'educator'})

        res.json({success: true, courses})
        
    } catch (error) {
        res.json({success: false, message: error.message})
        
    }
}



export const getCourseId = async (req,res)=> {

    const {id} = req.params


    try {
        
        const courseData = await Course.findById(id).populate({path:'educator'})
        
        courseData.courseContent.forEach(chapter => {
            chapter.chapterContent.forEach(lecture => {
                if (!lecture.isPreviewFree){ 
                    lecture.lectureUrl = '';
                }
            })
        })

        res.json({success: true, courseData})
    } catch (error) {
        res.json({success: false, message: error.message, courseData})
        
    }
}

export const getMaterials = async (req, res) => {
  try {
    const { id } = req.params;

    const materials = await StudyMaterial.find({ courseId: id });

    res.json({ success: true, materials });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getCertificate = async (req, res) => {
  try {
    const { id, userId } = req.params;

   
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

   
    const user = await User.findById(userId).select('name email image');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    const educator = await User.findOne({_id:course.educator}).select('name');
    if (!educator) {
      return res.status(404).json({ message: 'Educator not found' });
    }

    console.log("thisi ",educator)
    res.json({
      course,
      user,
      educator
    });

  } catch (error) {
    console.error('Error fetching certificate data:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};







export const createExam = async (req, res) => {
  try {
    const {  questions } = req.body;
    const {courseId} = req.params;

    
    if (!courseId) return res.status(400).json({ success: false, message: 'Course ID is required' });
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one question is required' });
    }

   
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

   
    const exam = new Exam({
      course: courseId,
      questions: questions.map(q => ({
        questionText: q.questionText,
        options: q.options,
        correctOption: q.correctOption,
      })),
    });

    await exam.save();

    res.status(201).json({ success: true, message: 'Assignment created successfully', exam });
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};



export const createAssignment = async (req, res) => {
  try {
    const { courseId, questions, deadline } = req.body;

    if (!courseId || !questions || !deadline) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const newAssignment = new Assignment({
      courseId,
      questions,
      deadline: new Date(deadline), 
    });

    await newAssignment.save();

    res.status(201).json({
      success: true,
      message: 'Assignment created successfully',
      assignment: newAssignment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};



export const updateEnrollment = async (req, res) => {
  try {
    const { userId } = req.params;
    const { courseId } = req.body;

    if (!userId || !courseId) {
      return res.status(400).json({ success: false, message: "User ID and Course ID required" });
    }

    // is user in course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    if (!course.enrolledStudents.includes(userId)) {
      return res.status(400).json({ success: false, message: "User is not enrolled in this course" });
    }

    // remove user from course
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { $pull: { enrolledStudents: userId } },
      { new: true }
    );

    // remove course from user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { enrolledCourses: courseId } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // delete progress, marsks, purchase data
    await Promise.all([
      CourseProgress.deleteMany({ userId, courseId }),
      Purchase.updateMany(
        { userId, courseId, status: 'completed' },
        { status: 'unenrolled' }
      ),
      Marks.deleteMany({ userId, courseId })
    ]);
    // debug
    res.status(200).json({
      success: true,
      message: "User unenrolled successfully - course progress, marks, and enrollment records updated",
      course: updatedCourse,
      user: updatedUser
    });

  } catch (error) {
    console.error("Error in updateEnrollment:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getUpcomingDeadlines = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const user = await User.findById(userId).populate('enrolledCourses');
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const enrolledCourseIds = user.enrolledCourses.map(course => course._id);

    const now = new Date();
    const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const upcomingAssignments = await Assignment.find({
      courseId: { $in: enrolledCourseIds },
      deadline: {
        $gte: now,
        $lte: twentyFourHoursFromNow
      }
    }).populate('courseId', 'courseTitle');

    const deadlineNotifications = upcomingAssignments.map(assignment => ({
      courseName: assignment.courseId.courseTitle,
      deadline: assignment.deadline,
      assignmentId: assignment._id
    }));

    res.status(200).json({
      success: true,
      notifications: deadlineNotifications
    });

  } catch (error) {
    console.error("Error fetching upcoming deadlines:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};





