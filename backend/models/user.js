import mongoose from "mongoose";

const ExperienceSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date }, // Nullable for ongoing roles
    role: { type: String, required: true },
    description: { type: String }
});

const PortfolioSchema = new mongoose.Schema({
    projectName: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ title: { type: String }, url: { type: String } }]
});

const EducationSchema = new mongoose.Schema({
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    startYear: { type: Number, required: true },
    endYear: { type: Number }
});

const LanguageSchema = new mongoose.Schema({
    language: { type: String, required: true },
    level: { type: String, enum: ["native", "fluent", "beginner"], required: true }
});

const CertificateSchema = new mongoose.Schema({
    title: { type: String, required: true },
    institute: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    certificate_img: { type: String }, // URL or file path
});

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["admin", "freelancer", "client"],
        default: "freelancer",
    },
    companyName: { type: String }, // Only required for clients
    profilePicture: { type: String }, // URL or file path
    skills: [{ type: String }],
    experience: [ExperienceSchema],
    portfolio: [PortfolioSchema],
    description: { type: String },
    title: { type: String },
    
    education: [EducationSchema],
    rate: { type: Number }, 
    languages: [LanguageSchema],
    certificates: [CertificateSchema]
});

const UserModel = mongoose.model("User", UserSchema);
export default UserModel;
