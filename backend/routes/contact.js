const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  host: "in-v3.mailjet.com",
  port: 587,
  secure: false, // Use STARTTLS
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
  logger: true, 
  debug: true
});

router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Email to the user
  const userMailOptions = {
    from: '"Confio Conference" <samyakjain720@gmail.com>',
    to: email,
    subject: 'Confirmation: We received your message!',
    text: 'Hello ${name},\n\nThank you for reaching out. We have received your message:\n\nSubject: ${subject}\nMessage: ${message}\n\nWe will get back to you as soon as possible.\n\nBest Regards,\nConfio Support Team'
  };

  // Email to the admin
  const adminMailOptions = {
    from: '"Confio Conference" <samyakjain720@gmail.com>',
    to: 'teamconfio@gmail.com', // Admin email
    subject: `New Contact Form Submission: ${subject}`,
    text: `Admin,\n\nA new contact form submission has been received:\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}\n\nPlease take the necessary action.\n\nBest Regards,\nConfio Support Team`
  };

  try {
    // Send emails to both the user and admin
    await transporter.sendMail(userMailOptions);
    await transporter.sendMail(adminMailOptions);

    res.status(200).json({ message: 'Emails sent successfully to the user and admin.' });
  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).json({ error: 'Failed to send emails.' });
  }
});

module.exports = router;