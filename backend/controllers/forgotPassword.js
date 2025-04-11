// controllers/authController.js
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import bcryptjs from 'bcryptjs';
import UserModel from '../models/user.js';

const verificationCodes = new Map(); // Store codes temporarily (consider using Redis for production)

export const sendResetCode = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    verificationCodes.set(email, { code, createdAt: Date.now() });

    // Send the code via email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    await transporter.sendMail({
      from: `"Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Code",
      text: `Your password reset code is: ${code}`
    });

    res.status(200).json({ success: true, message: "Reset code sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const verifyResetCode = async (req, res) => {
    const { email, code } = req.body;
  
    const entry = verificationCodes.get(email);
    if (!entry) return res.status(400).json({ success: false, message: "No reset request found" });
  
    const { code: storedCode, createdAt } = entry;
  
    if (Date.now() - createdAt > 10 * 60 * 1000) { // 10 min expiry
      verificationCodes.delete(email);
      return res.status(400).json({ success: false, message: "Code expired" });
    }
  
    if (storedCode !== code) {
      return res.status(400).json({ success: false, message: "Invalid code" });
    }
  
    res.status(200).json({ success: true, message: "Code verified" });
  };


  export const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;
  
    try {
      const user = await UserModel.findOne({ email });
      if (!user) return res.status(404).json({ success: false, message: "User not found" });
  
      const hashedPassword = await bcryptjs.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
  
      // Clean up verification entry
      verificationCodes.delete(email);
  
      res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
    