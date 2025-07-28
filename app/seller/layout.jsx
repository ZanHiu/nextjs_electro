"use client";
import Navbar from '@/components/seller/Navbar'
import Sidebar from '@/components/seller/Sidebar'
import React from 'react'

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <div className='flex w-full'>
        <Sidebar />
        <div className="flex-1 flex flex-col">{children}</div>
      </div>
    </div>
  )
}

export default Layout