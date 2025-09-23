import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
        <Navbar/>
        <main className='min-h-screen'>
            <Outlet/>
        </main>
        <Footer/>
    </div>
  )
}

export default MainLayout
