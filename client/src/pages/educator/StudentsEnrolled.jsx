import React, { useEffect, useState } from 'react'
import { dummyStudentEnrolled } from '../../assets/assets'
import Loading from '../../components/student/Loading'
import { AppContext } from '../../context/AppContext'
import { useContext } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const StudentsEnrolled = () => {

  const {backendUrl, getToken, isEducator} = useContext(AppContext)
  const [enrolledStudents, setEnrolledStudents] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchEnrolledStudents = async() => {
    try {
      setLoading(true);
      const token = await getToken();
      const {data} = await axios.get(backendUrl+'/api/educator/enrolled-students', {headers: {Authorization: `Bearer ${token}`}})
      if(data.success) {
        const students = data.enrolledStudents || [];
        setEnrolledStudents(students.reverse())
      } else {
        console.error('API Error:', data.message);
        setEnrolledStudents([]);
        toast.error(data.message || 'Failed to fetch enrolled students')
      }
    } catch (error) {
      console.error('Network Error:', error);
      setEnrolledStudents([]);
      toast.error(error.response?.data?.message || error.message || 'Failed to fetch enrolled students')
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=> {
    if(isEducator) {
      fetchEnrolledStudents()
    } else {
      setLoading(false)
    }
  },[isEducator])

  // If not an educator, show appropriate message
  if (!isEducator && !loading) {
    return (
      <div className='min-h-screen flex items-center justify-center p-8'>
        <div className='text-center'>
          <h2 className='text-xl font-semibold text-gray-800 mb-2'>Access Denied</h2>
          <p className='text-gray-600'>You need to be an educator to view this page.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div className='min-h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0'>
      <div className='flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20'>
        <table className='table-fixed md:table-auto w-full overflow-hidden pb-4'>
          <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left'>
            <tr>
              <th className='px-4 py-3 font-semibold text-center hidden sm:table-cell'>#</th>
              <th className='px-4 py-3 font-semibold '>Student Name</th>
              <th className='px-4 py-3 font-semibold '>Course Title</th>
              <th className='px-4 py-3 font-semibold text-center hidden sm:table-cell'>Date</th>
            </tr>
          </thead>
          <tbody className='text-sm text-gray-500'>
            {enrolledStudents && enrolledStudents.length > 0 ? enrolledStudents.map((item, index) => (
              <tr key={index} className='border-b border-gray-500/20'>
                <td className='px-4 py-3 text-center hidden sm:table-cell'>{index + 1}</td>
                <td className='md:px-4 px-2 py-3 flex items-center space-x-3'>
                  <img 
                    src={item.student?.imageUrl || '/default-avatar.png'} 
                    alt="student avatar" 
                    className='w-9 h-9 rounded-full object-cover'
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/36x36/6366f1/ffffff?text=S'
                    }}
                  />
                  <span className='truncate'>{item.student?.name || 'Unknown Student'}</span>
                </td>
                <td className='px-4 py-3 truncate'>{item.courseTitle || 'Unknown Course'}</td>
                <td className='px-4 py-3 hidden sm:table-cell'>
                  {item.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString() : 'N/A'}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className='px-4 py-8 text-center text-gray-500'>
                  No students enrolled yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default StudentsEnrolled
