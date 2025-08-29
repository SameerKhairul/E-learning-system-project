import React from 'react'
import { Route, Routes, useMatch } from 'react-router-dom'
import Home from './pages/student/Home'
import CoursesList from './pages/student/CoursesList'
import CourseDetails from './pages/student/CourseDetails'
import MyEnrollments from './pages/student/MyEnrollments'
import Player from './pages/student/Player'
import Loading from './components/student/Loading'
import Educator from './pages/educator/Educator'
import AddCourse from './pages/educator/AddCourse'
import Dashboard from './pages/educator/Dashboard'
import MyCourses from './pages/educator/MyCourses'
import StudentsEnrolled from './pages/educator/StudentsEnrolled'
import Navbar from './components/student/Navbar'
import "quill/dist/quill.snow.css";
import { ToastContainer} from 'react-toastify';
import StudentDashboard from './pages/student/StudentDashboard'
import CompletedCourses from './pages/student/CompletedCourses'
import Footer from './components/student/Footer'
import Certificate from './pages/student/Certificate'

import UploadExam from './pages/educator/UploadExam'
import UploadAssignment from './pages/educator/uploadAssignment'
import Leaderboard from './pages/student/Leaderboard'

const App = () => {

  const isEducatorRoute = useMatch('/educator/*')

  return (
    <div className='text-default min-h-screen bg-white flex flex-col'>
      <ToastContainer />
      {!isEducatorRoute && <Navbar />}
      <div className='flex-grow'>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/course-list' element={<CoursesList />}/>
          <Route path='/course-list/:input' element={<CoursesList />}/>
          <Route path='/course/:id' element={<CourseDetails />}/>
          <Route path='/my-enrollments' element={<MyEnrollments />}/>
          <Route path='/player/:courseId' element={<Player />}/>
          <Route path='/leaderboard/:courseId' element={<Leaderboard />}/>
          <Route path='/loading/:path' element={<Loading />}/>
            <Route path="/student" element={<StudentDashboard />}>
    {/* Default /student route */}
    <Route index element={<MyEnrollments />} />

    <Route path="completed-courses" element={<CompletedCourses />} />
    <Route path="my-enrollments" element={<MyEnrollments />} />
  </Route>
          <Route path='/certificate/:id' element={<Certificate/>}/>
          <Route path='/upload-exam/:courseId' element={<UploadExam/>}/>
          <Route path='/upload-assignment/:courseId' element={<UploadAssignment/>}/>
          <Route path='/educator' element={<Educator />}>
            <Route path='/educator' element={<Dashboard />} />
            <Route path='add-course' element={<AddCourse />} />
            <Route path='my-courses' element={<MyCourses />}/>
            <Route path='student-enrolled' element={<StudentsEnrolled />} />
          </Route>
        </Routes>
      </div>
      {!isEducatorRoute && <Footer/>}
    </div>
  )
}

export default App
