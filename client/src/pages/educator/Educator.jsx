import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../../components/educator/Navbar'
import SideBar from '../../components/educator/SideBar'

function Educator() {
  return (
    <div className='text-default min-h-screen bg-white'>
      <Navbar />
      <div  className='flex '>
        <SideBar/>
        <div>
           <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Educator