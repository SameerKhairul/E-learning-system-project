import React from 'react'
import {assets} from '../../assets/assets'

const Footer = () => {
  return (
    <footer className='bg-gray-900 md:px-36 text-center w-full mt-10'>
      <div className='flex flex-col md:flex-row items-center justify-center px-8 md:px-0 gap-10 md:gap-32 py-10 border-b border-white/30'>
        <div className='flex flex-col items-center w-full'>
          <img className='mx-auto' src={assets.logo_dark} alt="Logo" />
          <p className='mt-6 text-center text-sm text-white/80'>
            Thanks a lot for visiting our E-Learning system. Hope you have learned something new by staying with us.
          </p>
        </div>
        <div className='flex flex-col md:items-start items-center w-full'>
          <h2 className='font-semibold flex md:flex-col w-full justify-between text-sm text-white/80 md:space-y-2 py-5'>Company</h2>
          <ul className='flex md:flex-col w-full justify-between text-sm text-white/80 md:space-y-2'>
            <li><a href="#">Home</a></li>
            <li><a href="#">About us</a></li>
            <li><a href="#">Contact us</a></li>
            <li><a href="#">Privacy policy</a></li>
          </ul>
        </div>
        <div className='hidden md:flex flex-col items-start w-full'>
          <h2 className='font-semibold text-white mb-5'>Subscribe to our newsletter</h2>
          <p className='text-sm text-white/80'> The latest news will be sent to your inbox weekly.</p>
          <div className='flex items-center gap-2 pt-4'>
            <input type="email" placeholder='Enter Email' className='border border-gray-500/30 bg-gray-800 text-gray-500 placeholder-gray-500
             outline-none w-64 h-9 rounded px-2 text-sm'/>
            <button className='bg-blue-600 w-24 h-9 text-white rounded'>Subscribe</button>
          </div>
        </div>
      </div>
      <p className='text-center py-4 text-white/80'>Copyright 2025 @ BRACU. All Rights Reserved.</p>
    </footer>
  )
}

export default Footer
