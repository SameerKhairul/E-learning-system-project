import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  questions: [{ type: String, required: true }], // array of question strings
  deadline: { type: Date, required: true }, // deadline for the assignment
}, { timestamps: true });

const Assignment = mongoose.model('Assignment', assignmentSchema);

export default Assignment;
