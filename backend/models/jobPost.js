import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    tags: { type: [String], required: true }, // Array of tags
    role: { type: String, required: true }, // E.g., Developer, Designer
  
    salary:{
        type: Number, required: true
    },
  
    level: { type: String, enum: ['Entry', 'Medium', 'Expert'], required: true }, // Job level
    description: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // References the user who created the job
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Job', jobSchema);
