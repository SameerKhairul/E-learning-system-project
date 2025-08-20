import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  educatorId:String,
  review:String,
  userName:String
})

const Review = mongoose.model('reviews', reviewSchema);

export default Review;