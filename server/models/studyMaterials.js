import mongoose from 'mongoose';

const studyMaterialSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',    
    required: true
  },
  fileUrl: {
    type: String,
    required: true   
  },
}, { timestamps: true }); 

const StudyMaterial = mongoose.model('StudyMaterial', studyMaterialSchema);

export default StudyMaterial;