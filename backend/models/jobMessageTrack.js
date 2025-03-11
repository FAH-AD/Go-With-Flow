import mongoose from "mongoose";

const JobMessageTrackSchema = new mongoose.Schema({
  jobId: String,
  clientId: String,
  messagedFreelancers: [String], // Stores freelancer IDs
});

const JobMessageTrack = mongoose.model("JobMessageTrack", JobMessageTrackSchema);
export default JobMessageTrack;
