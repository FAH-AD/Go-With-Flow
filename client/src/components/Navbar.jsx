import React, { useState } from "react";
import logo from '../assets/logo.png'
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


function Navbar({ showFullNav,isLogged,role }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate =useNavigate()
  const handleLogout = async () => {
    try {
      await axios.post('/api/logout', {}, { withCredentials: true });
      localStorage.removeItem('authToken'); // Clear local storage if token is stored
      toast.success('Logged out successfully');
      navigate('/login'); // Redirect to login page
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout. Please try again.');
    }
  };

  

  return (
    <nav className="bg-black text-white border-primary border-b-[1px] py-2 px-6 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <a href="/" className="text-purple-500 text-2xl font-bold">
          <img src={logo} alt="" className="w-[180px]" />
        </a>

        {/* Desktop Menu */}
        {showFullNav && (
  <ul className="md:flex space-x-6 items-center">
  {role === "client" ? (
    <>
      <li>
        <a href="#" className="text-purple-400 hover:text-purple-300">
          Post Job
        </a>
      </li>
      <li>
        <a href="#" className="hover:text-purple-400">Talent</a>
      </li>
      <li>
        <a href="#" className="hover:text-purple-400">Reports</a>
      </li>
      <li>
        <a href="#" className="hover:text-purple-400">Messages</a>
      </li>
    </>
  ) : role === "freelancer" ? (
    <>
      <li>
        <a href="#" className="hover:text-purple-400">
          Search Job
        </a>
      </li>
      <li>
        <a href="#" className="hover:text-purple-400">Proposals</a>
      </li>
      <li>
        <a href="#" className="hover:text-purple-400">Analytics</a>
      </li>
      <li>
        <a href="#" className="hover:text-purple-400">Messages</a>
      </li>
    </>
  ) : role === "admin" ? (
    <>
      <li>
        <a href="#" className="hover:text-purple-400">
          Manage Users
        </a>
      </li>
      <li>
        <a href="#" className="hover:text-purple-400">Reports</a>
      </li>
      <li>
        <a href="#" className="hover:text-purple-400">Analytics</a>
      </li>
      <li>
        <a href="#" className="hover:text-purple-400">Messages</a>
      </li>
    </>
  ) : null}


    {!isLogged && (
      <li>
        <a href="#" className="hover:text-purple-400">About Us</a>
      </li>
    )}

    <li>
      <a
        href="#"
        className="text-purple-500 border border-purple-500 px-4 py-2 rounded-md hover:bg-purple-500 hover:text-white transition"
      >
        Contact Us
      </a>
    </li>

    {!isLogged && (
      <li>
        <a
          href="/login"
          className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition"
        >
          Login
        </a>
      </li>
    )}
     {isLogged && (
      <li>
        <a
          onClick={handleLogout}
          className=" text-purple-500 px-4 py-2 rounded-md border cursor-pointer border-purple-500  hover:bg-purple-500 hover:text-white transition"
        >
          LogOut
        </a>
      </li>
    )}
  </ul>
)}

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-purple-500 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && showFullNav && (
        <ul className="md:hidden bg-black text-white">
          <li className="py-2 px-4 hover:bg-gray-800">
            <a href="#">Home</a>
          </li>
          <li className="py-2 px-4 hover:bg-gray-800">
            <a href="#">Find Jobs</a>
          </li>
          <li className="py-2 px-4 hover:bg-gray-800">
            <a href="#">Employers</a>
          </li>
          <li className="py-2 px-4 hover:bg-gray-800">
            <a href="#">Admin</a>
          </li>
          <li className="py-2 px-4 hover:bg-gray-800">
            <a href="#">About Us</a>
          </li>
          <li className="py-2 px-4 hover:bg-gray-800">
            <a href="#" className="text-purple-500">
              Contact Us
            </a>
          </li>
          <li className="py-2 px-4 hover:bg-gray-800">
            <a href="#" className="bg-purple-500 text-white px-3 py-1 rounded">
              Login
            </a>
          </li>
        </ul>
      )}
    </nav>
  );
}

export default Navbar;
