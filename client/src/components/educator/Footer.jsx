import React from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div>
      <footer className='flex md:flex-row flex-col-reverse items-center justify-between text-left w-full px-8 border-t'>
        <div className='flex items-center gap-4'>
          <img src={assets.logo} alt="logo" className='hidden md:block w-20' />
          <div className='hidden md:block h-7 w-px bg-gray-500/60'></div>
          <p className='py-4 text-center text-xs md:text-sm text-gray-500'>
            Copyright 2025 @ BRACU. All Right Reserved.
          </p>
        </div>
        <div>
          <a href="#">
            <img src={assets.facebook_icon} alt="facebook_icon" />
          </a>
          <a href="#">
            <img src={assets.twitter_icon} alt="twitter_icon" />
          </a>
          <a href="#">
            <img src={assets.instagram_icon} alt="instagram_icon" />
          </a>
        </div>
      </footer>
    </div>
  )
}

export default Footer
