import express from 'express';
import { postJob, fetchJobs, getJobById, deleteJob } from '../controllers/jobController.js';
import { applyForJob, getJobApplications } from '../controllers/jobApplicationController.js';
import { isAdmin, isClient, isFreelancer } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Post a Job (Admin/Client Only)
router.post('/post', isClient, postJob);

// ✅ Fetch/Search Jobs
router.get('/fetch', fetchJobs);

// ✅ Get Job by ID
router.get('/:id', getJobById);

// ✅ Apply for a Job (Freelancers Only)
router.post('/:id/apply',  isFreelancer, applyForJob);

// ✅ Get All Applications for a Job (Client/Admin Only)
router.get('/:id/applications', getJobApplications);

// ✅ Delete a Job (Client/Admin Only)
router.delete('/:id', isAdmin, deleteJob);

export default router;
