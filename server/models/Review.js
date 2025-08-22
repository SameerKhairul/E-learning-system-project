import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  educatorId: String,
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  review: String,
  userName: String
}, { timestamps: true })

const Review = mongoose.model('reviews', reviewSchema);

export default Review;