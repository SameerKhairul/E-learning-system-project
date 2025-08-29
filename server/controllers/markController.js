import mongoose from "mongoose";
import { Marks } from "../models/Mark.js";
import Course from "../models/Course.js";

export const getCourseLeaderboard = async (req, res) => {
  try {
    const { courseId } = req.params;  

    // Get course information
    const course = await Course.findById(courseId);
    if (!course) {
      return res.json({ success: false, message: "Course not found" });
    }

    const topStudents = await Marks.find({ courseId })
      .sort({ totalMarks: -1, createdAt: 1 })
      .limit(5)
      .populate("userId", "name email");  

    res.json({ 
      success: true, 
      topStudents,
      courseName: course.courseTitle
    })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
};