import React from 'react'
import { Link } from 'react-router-dom'
import CourseCard from './CourseCard'
import { useContext } from 'react'
import { AppContext } from '../../context/AppContext'

const CoursesSection = () => {

  const {allCourses} = useContext(AppContext)

  return (
    <div className='py-16 md:px-40 px-8'>
      <h2 className='text-3xl font-medium text-gray-800 text-center'>Learn from the best</h2>
      <p className='text-center text-sm md:text-base text-gray-500 mt-3'>Discover our top-rated courses accross various categories.</p>

    <div className='grid grid-cols-auto px-4 md:px-0 md:my-16 my-10 gap-4'>
      {allCourses.slice(0,4).map((course, index) => <CourseCard key={index} course={course} />)}
    </div>

    <div className='flex justify-center mt-8'>
      <Link to='/course-list' onClick={()=>scrollTo(0,0)} className='text-gray-500 border border-gray-500/30 px-10 py-3 roudned'>
      Show all courses</Link>
    </div>
    </div>
  )
}

export default CoursesSection
