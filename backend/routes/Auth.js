import express from 'express';
import { CheckUser, login, logout, register } from '../controllers/Auth.js';
import { isAdmin,isClient,isFreelancer, authMiddleware } from '../middleware/authMiddleware.js';

const AuthRoutes = express.Router();

// General Auth Routes
AuthRoutes.post('/register', register);
AuthRoutes.post('/login', login);
AuthRoutes.post('/logout', logout);
AuthRoutes.get('/verify', async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: No token provided',
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Token is valid',
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Token verification failed:', error.message);
        return res.status(401).json({
            success: false,
            message: 'Unauthorized: Invalid or expired token',
        });
    }
});



// Check User (any authenticated user)
AuthRoutes.get('/CheckUser', isAdmin || isClient || isFreelancer , CheckUser);

// Role-specific routes for testing
AuthRoutes.get('/admin', isAdmin, (req, res) => {
    res.json({ success: true, message: 'Welcome, Admin!', user: req.user });
});

AuthRoutes.get('/freelancer', isFreelancer, (req, res) => {
    res.json({ success: true, message: 'Welcome, Freelancer!', user: req.user });
});

AuthRoutes.get('/client', isClient, (req, res) => {
    res.json({ success: true, message: 'Welcome, Client!', user: req.user });
});

export default AuthRoutes;
