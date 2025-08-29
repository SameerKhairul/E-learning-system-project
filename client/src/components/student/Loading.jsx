import React, { useEffect, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'

const Loading = () => {

  const {path} = useParams()
  const navigate = useNavigate()
  const { fetchUserEnrolledCourses, fetchUserData } = useContext(AppContext)

  useEffect(() => {
    if(path){
      const handleRedirect = async () => {
        // If redirecting to my-enrollments after payment, refresh enrollment data
        if(path === 'my-enrollments') {
          try {
            // Wait a bit for webhook to process
            await new Promise(resolve => setTimeout(resolve, 3000))
            // Refresh user data and enrolled courses
            await fetchUserData()
            await fetchUserEnrolledCourses()
          } catch (error) {
            console.error('Error refreshing enrollment data:', error)
          }
        }
        
        // Navigate after data refresh
        setTimeout(() => {
          navigate(`/${path}`)
        }, path === 'my-enrollments' ? 2000 : 5000)
      }
      
      handleRedirect()
    }
  },[])

  return (
    <div className='min-h-screen flex flex-col items-center justify-center'>
      <div className='w-16 sm:w-20 aspect-square border-4 border-gray-300 border-t-4 border-t-blue rounded-full animate-spin mb-4'>
      </div>
      {path === 'my-enrollments' && (
        <p className='text-gray-600 text-center'>
          Processing your enrollment...<br/>
          <span className='text-sm'>You'll be redirected shortly</span>
        </p>
      )}
    </div>
  )
}

export default Loading
