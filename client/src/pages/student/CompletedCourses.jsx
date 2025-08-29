import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const CompletedCourses = () => {
  const { userData, backendUrl, calculateCourseDuration} = useContext(AppContext);
  const [completedCourses, setCompletedCourses] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (!userData?._id) return;

    const fetchCompletedCourses = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/api/user/get-completed-courses/${userData._id}`
        );
        setCompletedCourses(res.data.courses || []);
      } catch (error) {
        console.error('Failed to fetch completed courses', error);
      }
    };

    fetchCompletedCourses();
  }, [userData, backendUrl]);

  const handleGetCertificate = (courseId) => {
    navigate(`/certificate/${courseId}`);
  };

  return (
    <div className="md:px-36 px-4 pt-10 w-full">
      <h1 className="text-2xl font-semibold mb-5">Completed Courses</h1>

      {completedCourses.length === 0 ? (
        <p>No completed courses found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm md:text-base">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Course</th>
                <th className="px-4 py-3 text-left font-semibold">Duration</th>
                <th className="px-4 py-3 text-left font-semibold">Completed</th>
                <th className="px-4 py-3 text-left font-semibold">Certificate</th>
              </tr>
            </thead>
            <tbody>
              {completedCourses.map((course) => (
                <tr key={course._id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 flex items-center space-x-3 min-w-[250px]">
                    <img
                      src={course.courseThumbnail}
                      alt={course.courseTitle}
                      className="w-14 sm:w-20 rounded"
                    />
                    <div className="flex-1">
                      <p className="mb-1">{course.courseTitle}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {calculateCourseDuration(course)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">All Lectures Completed</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      onClick={() => handleGetCertificate(course._id)}
                      className="px-3 py-1.5 bg-green-600 text-white rounded text-sm md:text-base cursor-pointer"
                    >
                      Get Certificate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CompletedCourses;
