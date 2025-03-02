import express from 'express';
import { Getuser, deletUser } from '../controllers/Admin.js';
import { isAdmin } from '../middleware/authMiddleware.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const AdminRoutes = express.Router();

// Get all users
AdminRoutes.get('/getuser', isAdmin, Getuser);

// Delete a user
AdminRoutes.delete('/delet/:id', isAdmin, deletUser);

// Send email to a user
AdminRoutes.post('/send-email', async (req, res) => {
  const { email, subject, message } = req.body;

  // Validate request body
  if (!email || !subject || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  try {
    // Create transporter for sending emails
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // Or use a different email provider
      auth: {
        user: process.env.EMAIL_USER, // Email address from environment variables
        pass: process.env.EMAIL_PASS, // Email password from environment variables
      },
    });

    // Email details
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender's email
      to: email, // Receiver's email
      subject: subject,
      text: message,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log(`Email sent: ${info.response}`);
    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email.' });
  }
});

export default AdminRoutes;
