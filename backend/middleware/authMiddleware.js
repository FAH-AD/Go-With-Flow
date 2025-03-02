import jwt from 'jsonwebtoken';
import UserModel from '../models/user.js';

// Middleware to check if the user has a valid token and matches the required role
const authMiddleware = (requiredRole) => {
    return async (req, res, next) => {
        try {
            const token = req.cookies.token; // Extract token from cookies

            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized: No token provided',
                });
            }

            // Verify token
            let decoded;
            try {
                decoded = jwt.verify(token, process.env.JWT_SECRET);
            } catch (error) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized: Invalid or expired token',
                });
            }

            // Fetch user
            const user = await UserModel.findById(decoded.userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found',
                });
            }

            // Role Check
            if (user.role !== requiredRole) {
                return res.status(403).json({
                    success: false,
                    message: `Forbidden: User is not a ${requiredRole}`,
                });
            }

            req.user = user; // Attach user data to the request object
            next(); // Pass to the next middleware or route handler
        } catch (error) {
            console.error(`${requiredRole} Middleware Error:`, error.message);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
            });
        }
    };
};

// Create middleware for each role
const isAdmin = authMiddleware('admin');
const isFreelancer = authMiddleware('freelancer');
const isClient = authMiddleware('client');

export { isAdmin, isFreelancer, isClient,authMiddleware };
