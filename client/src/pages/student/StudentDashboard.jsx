import React from 'react';
import StudentSidebar from '../../components/student/StudentSidebar';
import { Outlet } from 'react-router-dom';

const StudentDashboard = () => {
  return (
    <div className="min-h-screen flex bg-gray-50">
    
      <div className="w-64 h-screen  fixed border-r bg-white">
        <StudentSidebar />
      </div>

     
      <div className="flex-1 ml-64 p-6 overflow-auto">
        <Outlet /> 
      </div>
    </div>
  );
};

export default StudentDashboard;
