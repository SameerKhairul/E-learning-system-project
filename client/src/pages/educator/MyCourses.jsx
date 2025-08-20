import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/student/Loading';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const MyCourses = () => {
  const { userData, currency, backendUrl, isEducator } = useContext(AppContext);
  const userId = userData._id
  const [courses, setCourses] = useState(null);
 const navigate = useNavigate();

  const fetchEducatorCourses = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/educator/get-educator-course/${userId}`);
      if (response.data.success) {
        setCourses(response.data.courses);
      } else {
        toast.error(response.data.message || "Failed to fetch courses");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchEducatorCourses();
    }
  }, [isEducator]);

  if (!courses) return <Loading />;

 const handleNavigate  = (courseId) =>{
  navigate(`/upload-exam/${courseId}`)
 }

 const handleAssignmentNavigate = (courseId) =>{
  navigate(`/upload-assignment/${courseId}`)
 }

  return (
    <div className="h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className="w-full">
        <h2 className="pb-4 text-lg font-medium">My Courses</h2>
        <div>
          <table className="md:table-auto table-fixed w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
            <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-semibold truncate">All Courses</th>
                <th className="px-4 py-3 font-semibold truncate">Earnings</th>
                <th className="px-4 py-3 font-semibold truncate">Students</th>
                <th className="px-4 py-3 font-semibold truncate">Published On</th>
                <th className="px-4 py-3 font-semibold truncate">Actions</th> {/* New column */}
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {courses.map((course) => (
                <tr key={course._id} className="border-b border-gray-500/20">
                  <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                    <img src={course.courseThumbnail} alt="Course" className="w-16" />
                    <span className="truncate hidden md:block">{course.courseTitle}</span>
                  </td>
                  <td className="px-4 py-3">
                    {currency}{' '}
                    {Math.floor(
                      course.enrolledStudents.length *
                        (course.coursePrice - (course.discount * course.coursePrice) / 100)
                    )}
                  </td>
                  <td className="px-4 py-3">{course.enrolledStudents.length}</td>
                  <td className="px-4 py-3">{new Date(course.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleNavigate(course._id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Upload Exam
                    </button>

                     <button
                     onClick={()=>handleAssignmentNavigate(course._id)}
                      className="px-3 ml-4 py-1 bg-green-600 text-white rounded hover:bg-blue-700"
                    >
                      Upload Assignment
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyCourses;
