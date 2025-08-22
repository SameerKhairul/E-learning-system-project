import mongoose from "mongoose";
import { Marks } from "../models/Mark.js";

export const getCourseLeaderboard = async (req, res) => {
  try {
    const { courseId } = req.params;  

    const topStudents = await Marks.find({ courseId })
      .sort({ totalMarks: -1, createdAt: 1 })
      .limit(5)
      .populate("userId", "name email");  

    res.json({ success: true, topStudents })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
};