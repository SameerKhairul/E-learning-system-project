import mongoose from 'mongoose';


const optionSchema = new mongoose.Schema({
  text: { type: String, required: true }
});


const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: {
    type: [optionSchema],
    required: true,
    validate: {
      validator: function(val) {
        return val.length === 4;
      },
      message: '{PATH} must have exactly 4 options'
    }
  },
  correctOption: { 
    type: Number, 
    required: true,
    min: 0,
    max: 3 
  }
});


const examSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    questions: { type: [questionSchema], required: true },
  },
  { timestamps: true }
);

// Model
const Exam = mongoose.model('exams', examSchema); 
export default Exam;
