import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { Line } from 'rc-progress';
import { toast } from 'react-toastify';
import axios from 'axios';

const MyEnrollments = () => {
  const {
    enrolledCourses,
    calculateCourseDuration,
    navigate,
    userData,
    fetchUserEnrolledCourses,
    backendUrl,
    getToken,
    calculateNoOfLectures
  } = useContext(AppContext);

  const [progressArray, setProgressArray] = useState([]);

  const getCourseProgress = async () => {
    try {
      const token = await getToken();
      const tempProgressArray = await Promise.all(
        enrolledCourses.map(async (course) => {
          const { data } = await axios.post(
            `${backendUrl}/api/user/get-course-progress`,
            { courseId: course._id },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          let totalLectures = calculateNoOfLectures(course);
          const lectureCompleted = data.progressData
            ? data.progressData.lectureCompleted.length
            : 0;
          return { totalLectures, lectureCompleted };
        })
      );
      setProgressArray(tempProgressArray);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch course progress');
    }
  };

  useEffect(() => {
    if (userData) {
      fetchUserEnrolledCourses();
    }
  }, [userData]);

  // Additional effect to refresh data when component mounts (for post-payment scenarios)
  useEffect(() => {
    if (userData && enrolledCourses.length === 0) {
      // Small delay to ensure any pending enrollments are processed
      const timer = setTimeout(() => {
        fetchUserEnrolledCourses();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      getCourseProgress();
    }
  }, [enrolledCourses]);


  const handleRemove = async(courseId)=>{
    const userId = userData._id

    try{
      const response = await axios.put(`${backendUrl}/api/course/update-enrollment/${userId}`,{courseId})
      if(response.data.success) {
        toast.success('Course removed successfully!')
        // Refresh the enrolled courses list
        await fetchUserEnrolledCourses()
      }
    }catch(error){
      console.log(error)
      toast.error('Failed to remove course')
    }
  }

  return (
    <div className="md:px-36 px-4 pt-10 w-full">
      <h1 className="text-2xl font-semibold mb-5">My Enrollments</h1>

      {/* Scrollable table wrapper */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm md:text-base">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Course</th>
              <th className="px-4 py-3 text-left font-semibold">Duration</th>
              <th className="px-4 py-3 text-left font-semibold">Completed</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
               
            </tr>
          </thead>
          <tbody>
            {enrolledCourses.map((course, index) => (
              <tr
                key={index}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 flex items-center space-x-3 min-w-[250px]">
                  <img
                    src={course.courseThumbnail}
                    alt=""
                    className="w-14 sm:w-20 rounded"
                  />
                  <div className="flex-1">
                    <p className="mb-1">{course.courseTitle}</p>
                    <Line
                      strokeWidth={2}
                      percent={
                        progressArray[index]
                          ? (progressArray[index].lectureCompleted * 100) /
                            progressArray[index].totalLectures
                          : 0
                      }
                      className="bg-gray-300 rounded-full"
                    />
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {calculateCourseDuration(course)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {progressArray[index] &&
                    `${progressArray[index].lectureCompleted} / ${progressArray[index].totalLectures}`}{' '}
                  <span>Lectures</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate('/player/' + course._id)}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm md:text-base min-w-[100px] text-center"
                    >
                      {progressArray[index] &&
                      progressArray[index].lectureCompleted /
                        progressArray[index].totalLectures ===
                        1
                        ? 'Completed'
                        : 'Ongoing'}
                    </button>
                    <button
                      onClick={() => handleRemove(course._id)}
                      className="px-3 py-1.5 bg-red-600 text-white rounded text-sm md:text-base min-w-[70px] text-center"
                    >
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyEnrollments;
