import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Hero from '../components/Hero'
import Navbar from '../components/Navbar'
import FeaturedJobs from '../components/FeaturedJobs'
import companies from '../assets/Top Companies.png'
import Footer from '../components/Footer'
import FreelancerList from '../components/FreelancerList'

export default function Freelancer() {
  const user=useSelector((state)=>state.Auth.user)
  // console.log(user)
  const navigate=useNavigate()
  const disptach=useDispatch()
 

  return (
    <>

     <div className='bg-gradient-to-br from-black to-gray-800'>
    <Navbar showFullNav={true} isLogged={false} role='client'/>
    <Hero role={'client'}/>
    <FreelancerList/>


    <img src={companies} className='px-4 pl-8 mt-[5rem]' alt="" />
    <Footer/>
     </div>



    </>
  )
}
