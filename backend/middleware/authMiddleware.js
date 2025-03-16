import jwt from 'jsonwebtoken';
import UserModel from '../models/user.js';

// Middleware to check if the user has a valid token and matches the required role
const authMiddleware = (allowedRoles) => {
    return async (req, res, next) => {
        try {
            const token = req.cookies.token;
            if (!token) {
                return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
            }

            // Verify token
            let decoded;
            try {
                decoded = jwt.verify(token, process.env.JWT_SECRET);
            } catch (error) {
                return res.status(401).json({ success: false, message: 'Unauthorized: Invalid or expired token' });
            }

            // Fetch user
            const user = await UserModel.findById(decoded.userId);
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            // Check if user has one of the allowed roles
            if (!allowedRoles.includes(user.role)) {
                return res.status(403).json({ success: false, message: 'Forbidden: Access Denied' });
            }

            req.user = user;
            next();
        } catch (error) {
            console.error("Auth Middleware Error:", error.message);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    };
};


// Create middleware for each role
const isAdmin = authMiddleware('admin');
const isFreelancer = authMiddleware('freelancer');
const isClient = authMiddleware('client');

export { isAdmin, isFreelancer, isClient,authMiddleware };
