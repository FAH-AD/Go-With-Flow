import React, { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { toast } from 'react-hot-toast';

const Client = () => {
  const [formData, setFormData] = useState({
    title: "",
    tags: "",
    role: "",
    salary_min: "",
    salary_max: "",
    vacancies: "",
    level: "",
    description: ""
  });
 
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const token = localStorage.getItem("authToken");

  // Validate and submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    const {
      title,
      tags,
      role,
      salary,
      vacancies,
      level,
      description
    } = formData;

    if (!title || !tags || !role || !salary || !vacancies || !level || !description) {
      toast.error("All fields are required.");
      return;
    }

   

    if (parseInt(vacancies) <= 0) {
      toast.error("Vacancies must be a positive number.");
      return;
    }

    try {
      const response = await axios.post("/api/jobs", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFormData({
        title: "",
        tags: "",
        role: "",
        salary: "",
       
        vacancies: "",
        level: "",
        description: ""
      });
      toast.success("Job posted successfully");
    } catch (error) {
      console.error("Error posting job:", error);
      toast.error("Failed to post the job. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-10">
     <Navbar showFullNav={true} isLogged={false} role='client'/>
      <div className="bg-black w-full max-w-5xl m-auto px-8 py-10 shadow-lg rounded-lg">
        <h2 className="text-2xl text-left text-white font-bold mb-2">Post a Job</h2>
        <p className="text-gray-400 mb-8">Find the best talent for your company</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-400 mb-1">Job Title</label>
            <input
              type="text"
              name="title"
              placeholder="Add job title, role vacancies, etc."
              className="w-full p-3 rounded-md text-black"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-400 mb-1">Tags</label>
              <input
                type="text"
                name="tags"
                placeholder="Job keywords, tags, etc."
                className="w-full p-3 rounded-md text-black"
                value={formData.tags}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">Job Role</label>
              <select
                name="role"
                className="w-full p-3 rounded-md text-black"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="">Select...</option>
                <option value="Developer">Developer</option>
                <option value="Designer">Designer</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-gray-400 mb-1">Salary</label>
              <input
                type="number"
                name="salary"
                placeholder="Salary..."
                className="w-full p-3 rounded-md text-black"
                value={formData.salary}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">Job Level</label>
              <select
                name="level"
                className="w-full p-3 rounded-md text-black"
                value={formData.level}
                onChange={handleChange}
              >
                <option value="">Select...</option>
                <option value="Entry">Entry</option>
                <option value="Medium">Medium</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 mb-1">Vacancies</label>
              <input
                type="number"
                name="vacancies"
                placeholder="Number of vacancies"
                className="w-full p-3 rounded-md text-black"
                value={formData.vacancies}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-400 mb-1">Job Description</label>
            <textarea
              name="description"
              placeholder="Add your description..."
              rows="5"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 rounded-md text-black"
            ></textarea>
          </div>

          <div className="flex justify-start">
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-md"
            >
              Post Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Client;
