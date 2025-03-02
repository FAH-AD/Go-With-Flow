import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true }, // Reference to Job
    freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Freelancer who applied
    coverLetter: { type: String, required: true },
    price: { type: Number, required: true },
    attachments: [{ type: String }], // Array of image URLs or file paths
    createdAt: { type: Date, default: Date.now }
});

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);
export default JobApplication;
