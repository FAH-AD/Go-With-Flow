import JobApplication from '../models/jobApplication.js';


/**
 * APPLY FOR JOB - Allows authenticated freelancers to apply for a job.
 */
const applyForJob = async (req, res) => {
    try {

        console.log("req.user", req.user);
        // Ensure user is logged in as a freelancer
        if (!req.user || req.user.role !== 'freelancer') {
            return res.status(403).json({ success: false, message: "Only freelancers can apply for jobs." });
        }
     
        const { jobId, coverLetter, price } = req.body;
        const freelancerId = req.user._id; // Logged-in freelancer ID

        // Validate required fields
        if (!jobId || !coverLetter || !price) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Extract file paths if attachments exist
        const attachments = req.files ? req.files.map(file => file.path) : [];

        // Create and save job application
        const application = new JobApplication({
            jobId,
            freelancerId,
            coverLetter,
            price,
            attachments
        });

        await application.save();

        res.status(201).json({
            success: true,
            message: "Job application submitted successfully",
            application
        });

    } catch (error) {
        console.error("Error applying for job:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

/**
 * GET JOB APPLICATIONS FUNCTION - Fetches all applications for a specific job.
 * Only Clients or Admins can view job applications.
 */
const getJobApplications = async (req, res) => {
    try {
        const jobId = req.params.id;

        // Find applications related to the given job ID
        const applications = await JobApplication.find({ jobId })
            .populate('freelancerId', 'name email') // Fetch freelancer details (only name & email)
            .sort({ createdAt: -1 }); // Sort by latest applications first

        if (!applications.length) {
            return res.status(404).json({ success: false, message: "No applications found for this job." });
        }

        res.status(200).json({ success: true, applications });
    } catch (error) {
        console.error("Error fetching job applications:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};



export { applyForJob,getJobApplications };
