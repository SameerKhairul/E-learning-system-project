import React from 'react'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'

const StudentSidebar = () => {

const menuItems = [
  { name: 'Dashboard', path: '/student/my-enrollments',icon: assets.home_icon },
  { name: 'Completed Course', path: '/student/completed-courses', icon: assets.add_icon },
];

  return (
    <div className='md:w-64 w-16 border-r min-h-screen text-base border-gray-500 py-2 flex flex-col'>
      <div className='p-4 border-b border-gray-200'>
        <h2 className='text-lg font-semibold text-gray-800 hidden md:block'>Student Dashboard</h2>
      </div>
      {menuItems.map((item)=>(
        <NavLink
          to={item.path}
          key={item.name}
          end={item.path === '/student'}
          className={({ isActive }) => `flex items-center md:flex-row flex-col md:justify-start justify-center py-3.5 md:px-10 gap-3
          ${isActive ? 'bg-indigo-50 border-r-[6px] border-indigo-500/90': 'hover:bg-gray-100/90 border-r-[6px] border-white hover:border-gray-100/90'}`}>
          <img src={item.icon} alt="item icon" className='w-6 h-6' />
          <p className='md:block hidden text-center'>{item.name}</p>
        </NavLink>
      ))}
    </div>
  )
}

export default StudentSidebar
