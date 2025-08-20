import React, { useContext, useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Certificate = () => {
  const { id } = useParams();
  const { backendUrl, userData } = useContext(AppContext);
  const userId = userData._id;

  const [course, setCourse] = useState(null);
  const [user, setUser] = useState(null);
  const [educator, setEducator] = useState(null);
  const certificateRef = useRef();

  const fetchCourse = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/course/get-certificate/${id}/${userId}`
      );
      setCourse(response.data.course);
      setUser(response.data.user);
      setEducator(response.data.educator);
    } catch (error) {
      console.log(error);
    }
  };

  const downloadPDF = () => {
    const input = certificateRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      pdf.save('certificate.pdf');
    });
  };

  useEffect(() => {
    fetchCourse();
  }, []);

  const today = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  space-y-6">
      {/* Certificate card */}
      <div
        ref={certificateRef}
        className="w-[900px] p-12 border-8 border-gray-800 bg-white shadow-xl text-center"
      >
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4">
          Certificate of Completion
        </h1>
        <p className="mb-4 text-lg text-gray-700">
          This certificate is proudly presented to
        </p>
        <h2 className="text-3xl font-semibold mb-2 text-gray-900">{user?.name}</h2>
        <p className="mb-4 text-gray-600">{user?.email}</p>
        <p className="text-lg mb-6 text-gray-700">
          For successfully completing the course:
        </p>
        <h3 className="text-2xl font-bold text-gray-800">{course?.courseTitle}</h3>

        {/* Signature area */}
        <div className="flex justify-between mt-16 px-12">
          <div className="text-center">
            <p className="mb-2 text-gray-900 font-medium">{educator?.name || 'Instructor'}</p>
            <hr className="border-t border-gray-900 w-44 mx-auto" />
            <p className="text-sm text-gray-600 mt-1">Instructor</p>
          </div>
          <div className="text-center">
            <p className="mb-2 text-gray-900 font-medium">{today}</p>
            <hr className="border-t border-gray-900 w-44 mx-auto" />
            <p className="text-sm text-gray-600 mt-1">Date</p>
          </div>
        </div>
      </div>

      {/* Download button outside the certificate */}
      <button
        onClick={downloadPDF}
        className="px-6 py-2 bg-gray-800 text-white rounded shadow hover:bg-gray-900"
      >
        Download as PDF
      </button>
    </div>
  );
};

export default Certificate;
