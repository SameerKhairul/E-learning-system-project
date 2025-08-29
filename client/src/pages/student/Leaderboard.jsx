import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Leaderboard = () => {
  const [topStudents, setTopStudents] = useState([]);
  const [courseName, setCourseName] = useState('');
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
          setCourseName(res.data.courseName || '');
          //console.log("Top Students:", res.data.topStudents);
        } else {
          setTopStudents([]);  
          setCourseName('');
        }
      })
      .catch((err) => {
        console.error(err);
        setTopStudents([]);
        setCourseName(''); 
      });
  }, [courseId]);

  // Function to generate 5 rows, filling empty ones with placeholders
  const generateTableRows = () => {
    const rows = [];
    
    // Add actual student data
    for (let i = 0; i < Math.min(topStudents.length, 5); i++) {
      const student = topStudents[i];
      const isUser = userData._id === student.userId?._id;
      rows.push(
        <tr key={student._id}>
          <td className="border border-gray-400 px-4 py-2">{i + 1}</td>
          <td className="border border-gray-400 px-4 py-2">{student.userId?.name || "N/A"} {isUser && "(You)"}</td>
          <td className="border border-gray-400 px-4 py-2">{student.userId?.email || "N/A"}</td>
          <td className="border border-gray-400 px-4 py-2">{student.totalMarks ?? "N/A"}</td>
        </tr>
      );
    }
    
    // Fill remaining rows with placeholders
    for (let i = topStudents.length; i < 5; i++) {
      rows.push(
        <tr key={`placeholder-${i}`}>
          <td className="border border-gray-400 px-4 py-2">------</td>
          <td className="border border-gray-400 px-4 py-2">------</td>
          <td className="border border-gray-400 px-4 py-2">------</td>
          <td className="border border-gray-400 px-4 py-2">------</td>
        </tr>
      );
    }
    
    return rows;
  };

return (
  <div className="flex flex-col items-center justify-center p-6">
    <h1 className="text-2xl font-bold mb-2">Course Leaderboard</h1>
    {courseName && (
      <h2 className="text-lg text-gray-600 mb-4">{courseName}</h2>
    )}
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
        {generateTableRows()}
      </tbody>
    </table>
  </div>
);
}
export default Leaderboard;
 