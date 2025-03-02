import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { post } from '../services/ApiEndpoint'
import { Logout } from '../redux/AuthSlice'
import Hero from '../components/Hero'
import Navbar from '../components/Navbar'
import FeaturedJobs from '../components/FeaturedJobs'
import Footer from '../components/Footer'
import companies from '../assets/Top Companies.png'

export default function Freelancer() {
  const user=useSelector((state)=>state.Auth.user)
  // console.log(user)
  const navigate=useNavigate()
  const disptach=useDispatch()
  const gotoAdmin=()=>{
        navigate('/admin')
  }
  const handleLogout=async()=>{
    try {
      const request= await post('/api/logout')
       const resspone= request.data
       if (request.status==200) {
           disptach(Logout())
          navigate('/login')
       }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>

<div className='bg-gradient-to-br from-black to-gray-800'>
    <Navbar showFullNav={true} isLogged={true} role='freelancer'/>
    <Hero role={'freelancer'}/>
    <FeaturedJobs/>

    <img src={companies} className='px-4 pl-8 mt-[5rem]' alt="" />
    <Footer/>
     </div>



    </>
  )
}
