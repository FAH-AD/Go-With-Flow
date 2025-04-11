import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Paperclip } from "lucide-react";
import Navbar from "../components/Navbar";
import { toast } from 'react-hot-toast';
import { useSelector } from "react-redux";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function ApplyOnJob() {
    const { state } = useLocation();
    const job = state?.job;

    const [coverLetter, setCoverLetter] = useState("");
    const [attachments, setAttachments] = useState([]);
    const [hourlyRate, setHourlyRate] = useState("");
    const [uploading, setUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = async (e) => {
        const files = e.target.files;
        if (!files.length) return;

        const uploadedFiles = [];
        setUploading(true);

        for (let file of files) {
            const data = new FormData();
            data.append("document", file);

            try {
                const res = await fetch("http://localhost:5000/api/upload", {
                    method: "POST",
                    body: data,
                });

                const result = await res.json();

                if (res.ok && result.fileUrl) {
                    uploadedFiles.push({
                        url: result.fileUrl,
                        name: file.name,
                    });
                }
            } catch (err) {
                console.error("Upload error:", err);
            }
        }

        setAttachments([...attachments, ...uploadedFiles]);
        setUploading(false);
    };
    const user = useSelector((state) => state.Auth.user);
    const freelancerId = user?._id;
  
    
  

const handleSubmit = async () => {
    const token = localStorage.getItem("authToken");
    if (!token || !freelancerId) {
        toast.error("You must be logged in as a freelancer to apply.");
        return;
    }

    const payload = {
        jobId: job._id,
        freelancerId,
        coverLetter,
        price: Number(hourlyRate),
        attachments: attachments.map((file) => file.url),
        createdAt: new Date().toISOString(),
    };

    setIsSubmitting(true);
    console.log("token", token);

    try {
        const res = await axios.post(`http://localhost:5000/api/jobs/${job._id}/apply`, payload, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (res.status === 200) {
            toast.success("Application submitted successfully!");
            setTimeout(() => navigate("/freelancer"), 2000); // slight delay for UX
        } else {
            toast.error(res.data.message || "Failed to apply.");
        }
    } catch (err) {
        console.error("Submit error:", err);
        toast.error("Something went wrong. Please try again.");
    } finally {
        setIsSubmitting(false);
    }
};


    if (!job) return <div className="text-white p-10">No job data found.</div>;

    return (
        <div className="bg-black min-h-screen text-white font-sans">
            <Navbar showFullNav={true} isLogged={true} role="freelancer" />

            <div className="max-w-4xl  text-black rounded-xl mx-auto py-10 px-6 space-y-10">

                {/* Job Details */}
                <section className="border border-gray-300 p-6 rounded-xl bg-white">
                    <h2 className="text-2xl font-bold mb-2">{job.title}</h2>
                    <p className="text-gray-700 mb-4">{job.description}</p>
                    <div className="text-sm text-gray-800 space-y-1">
                        <p><strong>Salary:</strong> {job.salary} PKR</p>
                        <p><strong>Posted by:</strong> {job.clientName}</p>
                    </div>

                    {job.tags?.length > 0 && (
                        <>
                            <h3 className="text-lg font-semibold mt-6 mb-2">Skills and Expertise</h3>
                            <div className="flex flex-wrap gap-2">
                                {job.tags.map((skill, i) => (
                                    <span key={i} className="bg-gray-200 text-sm px-3 py-1 rounded-full">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </>
                    )}
                </section>

                {/* Terms Section */}
                <section className="bg-white border border-gray-300 p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">Terms</h3>
                    <div className="mb-2">
                        <label className="block text-sm mb-1 text-gray-800">Your Rate</label>
                        <input
                            type="number"
                            min={1}
                            placeholder="Enter your offered rate"
                            value={hourlyRate}
                            onChange={(e) => setHourlyRate(e.target.value)}
                            className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md"
                        />
                    </div>
                </section>

                {/* Additional Details */}
                <section className="bg-white border border-gray-300 p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">Additional Details</h3>

                    <label className="block mb-2 text-sm text-gray-800">Cover Letter</label>
                    <textarea
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        placeholder="Write your proposal cover letter..."
                        rows={6}
                        className="w-full p-3 bg-gray-100 text-black border border-gray-300 rounded-md resize-none mb-4"
                    />

                    <div className="mb-4">
                        <label className="block text-sm text-gray-800 mb-1">Attachments</label>
                        <div className="flex items-center gap-3">
                            <label className="cursor-pointer bg-purple-700 hover:bg-purple-800 text-white text-sm px-4 py-2 rounded inline-flex items-center">
                                <Paperclip size={16} className="mr-2" />
                                Upload File
                                <input
                                    type="file"
                                    multiple
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </label>
                            {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
                        </div>
                        <ul className="mt-3 text-sm text-gray-700">
                            {attachments.map((file, i) => (
                                <li key={i} className="mt-1">{file.name}</li>
                            ))}
                        </ul>
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="bg-purple-600 w-full hover:bg-purple-700 px-6 py-3 text-white font-semibold rounded shadow mt-4 transition-transform hover:scale-102 transition-all disabled:opacity-50"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2 justify-center">
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8H4z"
                                    ></path>
                                </svg>
                                Applying...
                            </span>
                        ) : (
                            "Submit Application"
                        )}
                    </button>

                </section>
            </div>
        </div>
    );


}
