import JobModel from '../models/jobPost.js';

/**
 * POST JOB FUNCTION - Allows authenticated users to post a job.
 * Only Admins or Clients are allowed to post jobs.
 */
const postJob = async (req, res) => {
    try {
        console.log("User making request:", req.user); // Debugging
        
        const { title, tags, role, salary, level, description } = req.body;

        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized: No user found." });
        }

        if (!['admin', 'client'].includes(req.user.role)) {
            return res.status(403).json({ success: false, message: "You are not authorized to post jobs." });
        }

        const newJob = new JobModel({
            title,
            tags,
            role,
            salary,
            level,
            description,
            createdBy: req.user._id
        });

        const savedJob = await newJob.save();
        res.status(201).json({ success: true, message: "Job posted successfully", job: savedJob });

    } catch (error) {
        console.error("Error in postJob:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


const getJobById = async (req, res) => {
    try {
        const job = await JobModel.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }
        res.status(200).json({ success: true, job });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const deleteJob = async (req, res) => {
    try {
        const job = await JobModel.findById(req.params.id);
        
        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }

        // Ensure only the job creator or an admin can delete the job
        if (req.user.role !== 'admin' && job.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        await job.deleteOne();
        res.status(200).json({ success: true, message: "Job deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
const fetchJobs = async (req, res) => {
    try {
        const {
            search,
            salaryMin,
            salaryMax,
            jobType,
            level // Entry, Medium, Expert
        } = req.query;

        // Base query
        let query = {};

        // Text search
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Salary range
        if (salaryMin || salaryMax) {
            query.salary = {};
            if (salaryMin) query.salary.$gte = Number(salaryMin);
            if (salaryMax) query.salary.$lte = Number(salaryMax);
        }

        // Job type filter (e.g., Full Time, Part Time)
        if (jobType) {
            const jobTypes = jobType.split(',');
            query.jobType = { $in: jobTypes };
        }

        // Job level filter (e.g., Entry, Medium, Expert)
        if (level) {
            const levels = level.split(',');
            query.level = { $in: levels };
        }

        // Fetch jobs and populate client info
        const jobs = await JobModel.find(query)
            .sort({ createdAt: -1 })
            .populate({
                path: 'createdBy',
                select: 'name profilePicture'
            });

        const DEFAULT_IMAGE = 'https://res.cloudinary.com/dxmeatsae/image/upload/v1744198536/uploads/tep04pn8luh3bt2n24g6.png';

        // Add fallback profile picture
        const jobsWithClient = jobs.map(job => {
            const jobObj = job.toObject();
            const client = jobObj.createdBy || {};
            return {
                ...jobObj,
                clientName: client.name || 'Unknown Client',
                clientProfilePicture: client.profilePicture || DEFAULT_IMAGE
            };
        });

        res.status(200).json({ success: true, jobs: jobsWithClient });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};





export { postJob ,getJobById,deleteJob,fetchJobs};
