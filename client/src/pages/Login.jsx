import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { post } from '../services/ApiEndpoint';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { SetUser } from '../redux/AuthSlice';
import Navbar from '../components/Navbar';
import login from '../assets/login-img.png';

export default function Login() {
  const user = useSelector((state) => state.Auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const request = await post('/api/login', { email, password });
      const response = request.data;

      if (request.status === 200) {
        localStorage.setItem("authToken", response.token);
        dispatch(SetUser(response.user));
        toast.success(response.message);

        if (response.user.role === 'admin') {
          navigate('/admin');
        } else if (response.user.role === 'client') {
          navigate('/client');
        } else if (response.user.role === 'freelancer') {
          navigate('/freelancer');
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('Login failed. Invalid Credentials.');
    }
  };

  return (
    <>
      <Navbar showFullNav={false} />
      <div className="bg-black min-h-screen pt-4 px-4">
        <div className='max-w-6xl w-full m-auto'>
          <h1 className="text-4xl font-bold text-white mb-2">Login to your Account</h1>
          <p className="text-gray-500 mb-8">
            Welcome back! Select the below login methods.
          </p>
        </div>

        <div className="bg-white max-w-6xl w-full m-auto rounded-xl shadow-md flex flex-col md:flex-row">
          <div className="flex-1 p-8 md:p-12">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email ID / Username</label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email id / username"
                  className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6300B3]"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#6300B3]"
                />
              </div>

              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="text-[#6300B3]" />
                  <span className="text-gray-700">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-[#6300B3] hover:underline">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                className="bg-[#6300B3] hover:bg-purple-700 text-white font-bold w-full py-2 rounded-md"
              >
                Login
              </button>
            </form>

            <p className="mt-8 text-center text-gray-600">
              Don’t have an account?{' '}
              <Link to="/register" className="text-[#6300B3] font-semibold hover:underline">
                Register
              </Link>
            </p>
          </div>

          <div className="hidden md:flex flex-1 justify-center items-center rounded-r-lg">
            <img src={login} alt="Illustration" className="w-80 h-120" />
          </div>
        </div>
      </div>
    </>
  );
}