import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Leaderboard = () => {
  const [topStudents, setTopStudents] = useState([]);
  const { courseId } = useParams();
  const { backendUrl, userData } = useContext(AppContext);
  console.log("courseId:", courseId);

  useEffect(() => {
    if (!courseId) return;  

    axios
      .get(`${backendUrl}/api/marks/leaderboard/${courseId}`)
      .then((res) => {
        if (res.data.success ) {
          //console.log("Top Students Data:", res.data);
          setTopStudents(res.data.topStudents);
          //console.log("Top Students:", res.data.topStudents);
        } else {
          setTopStudents([]);  
        }
      })
      .catch((err) => {
        console.error(err);
        setTopStudents([]); 
      });
  }, [courseId]);

return (
  <div className="flex flex-col items-center justify-center p-6">
    <h1 className="text-2xl font-bold mb-4">Course Leaderboard</h1>
    <table className="border-collapse border border-gray-400 text-center w-full max-w-3xl">
      <thead className="bg-gray-200">
        <tr>
          <th className="border border-gray-400 px-4 py-2">Rank</th>
          <th className="border border-gray-400 px-4 py-2">Name</th>
          <th className="border border-gray-400 px-4 py-2">Email</th>
          <th className="border border-gray-400 px-4 py-2">Total Marks</th>
        </tr>
      </thead>
      <tbody>
        {topStudents.length > 0 ? (
          topStudents.map((student, index) => {
            const isUser = userData._id === student.userId?._id;
            return (
              <tr key={student._id}>
                <td className="border border-gray-400 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-400 px-4 py-2">{student.userId?.name || "N/A"} {isUser && "(You)"}</td>
                <td className="border border-gray-400 px-4 py-2">{student.userId?.email || "N/A"}</td>
                <td className="border border-gray-400 px-4 py-2">{student.totalMarks ?? "N/A"}</td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan="4" className="border border-gray-400 px-4 py-4 text-gray-500">
              No data available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);
}
export default Leaderboard;
 