import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../../components/educator/Navbar'
import SideBar from '../../components/educator/SideBar'
import Footer from '../../components/educator/Footer'

function Educator() {
  return (
    <div className='text-default min-h-screen w-full bg-white'>
      <Navbar />
      <div  className='flex '>
        <SideBar/>
        <div className='w-full'>
           <Outlet />
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default Educator