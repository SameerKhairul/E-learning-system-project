// Migration script to add courseId to existing reviews
// Run this once to update existing reviews in the database

import mongoose from 'mongoose';
import Review from './models/Review.js';
import Course from './models/Course.js';
import 'dotenv/config';

const migrateReviews = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all reviews without courseId
    const reviewsWithoutCourseId = await Review.find({ courseId: { $exists: false } });
    console.log(`Found ${reviewsWithoutCourseId.length} reviews without courseId`);

    if (reviewsWithoutCourseId.length === 0) {
      console.log('No migration needed. All reviews already have courseId');
      process.exit(0);
    }

    // For each review, find the first course by the educator and assign it
    // Note: This is a simple migration. In production, you might want more sophisticated logic
    for (const review of reviewsWithoutCourseId) {
      const educatorCourse = await Course.findOne({ educator: review.educatorId });
      
      if (educatorCourse) {
        await Review.findByIdAndUpdate(review._id, { 
          courseId: educatorCourse._id 
        });
        console.log(`Updated review ${review._id} with courseId ${educatorCourse._id}`);
      } else {
        console.log(`No course found for educator ${review.educatorId}, keeping review as is`);
      }
    }

    console.log('Migration completed successfully');
    process.exit(0);

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

// Run migration
migrateReviews();