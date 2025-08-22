import mongoose from "mongoose";

const MarksSchema = new mongoose.Schema({
    courseId: {type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    userId: {type: String,
        ref: 'User',
        required: true
    },
    marks: [
    {
      title: { type: String, required: false},    
      score: { type: Number, required: false },    
      outof: { type: Number, required: false }     
    }
  ],
  totalMarks: { type: Number, default: 0 },
},{timestamps : true}
);

export const Marks = mongoose.model('Marks', MarksSchema);