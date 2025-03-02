import UserModel from "../models/user.js";
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * REGISTER FUNCTION - Creates a new user account.
 * Supports three roles: Admin, Freelancer, and Client.
 * - Admin: General registration.
 * - Freelancer: Basic user role.
 * - Client: Includes company information and document upload.
 */


const register = async (req, res) => {
    try {
        const { 
            name, email, password, role, companyName, profilePicture, skills, experience, 
            portfolio, description, title, education, rate, languages, certificates 
        } = req.body;

        // Check if user with the provided email already exists
        const existUser = await UserModel.findOne({ email });
        if (existUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Prepare user object with conditional data
        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword,
            role: role || "freelancer", // Default role is 'freelancer'
            ...(role === "client" && { companyName }), // Additional field for Client role
            ...(role === "freelancer" && { 
                profilePicture, 
                skills, 
                experience, 
                portfolio, 
                description, 
                title, 
                education, 
                rate, 
                languages, 
                certificates 
            }) // Additional fields for Freelancer role
        });

        // Save the new user to the database
        await newUser.save();

        res.status(201).json({ success: true, message: "User registered successfully", newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export default register;

/**
 * LOGIN FUNCTION - Authenticates user credentials.
 * Generates a JWT token for the logged-in user.
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "Invalid credentials" });
        }

        // Validate password
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role }, // Payload includes userId and role
            process.env.JWT_SECRET,
            { expiresIn: "1h" } // Token valid for 1 hour
        );

        // Set the token as an HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use 'secure' in production
            maxAge: 3600000, // 1 hour
        });

        res.status(200).json({ success: true, message: "Login successful", token, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

/**
 * LOGOUT FUNCTION - Clears the authentication token.
 */
const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ success: true, message: "User logged out successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

/**
 * CHECK USER FUNCTION - Returns user information for an authenticated request.
 */
const CheckUser = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Export functions for use in routes
export { register, login, logout, CheckUser };
