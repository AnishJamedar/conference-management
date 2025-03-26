const express = require('express');
const router = express.Router();
const Mentor = require('../models/Mentor'); // Update the path to your Mentor model
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "in-v3.mailjet.com", // Mailjet host
  port: 587, // Mailjet port
  secure: false, // Use TLS
  auth: {
    user: process.env.EMAIL_USER, // Your Mailjet API key (from .env)
    pass: process.env.EMAIL_PASS, // Your Mailjet API secret (from .env)
  },
  logger: true, 
  debug: true 
});

// Get all mentors
router.get('/mentors', async (req, res) => {
  try {
    const mentors = await Mentor.findAll({
      attributes: ['id', 'name', 'bio', 'conference_id', 'available_datetime1', 'available_datetime2'], // Fields to fetch
    });
    res.json(mentors);
  } catch (error) {
    console.error('Error fetching mentors:', error);
    res.status(500).json({ error: 'Failed to fetch mentors' });
  }
});

// Register a user with a mentor and send an email confirmation
router.post('/registerMentor', async (req, res) => {
  const { email, mentorId, selectedSlot } = req.body;

  try {
    const mentor = await Mentor.findByPk(mentorId);

    if (!mentor) {
      return res.status(404).json({ error: 'Mentor not found' });
    }

    // Ensure the selected slot is valid
    if (![mentor.available_datetime1, mentor.available_datetime2].includes(selectedSlot)) {
      return res.status(400).json({ error: 'Invalid time slot selected' });
    }

    // Send email to the user
    const mailOptions = {
      from: '"Confio Mentorship" <samyakjain720@gmail.com>', // Sender address
      to: email, // Recipient email
      subject: 'Mentorship Registration Confirmation',
      text: `Dear User,\n\nYou have successfully registered under the mentor: ${mentor.name}.\n\nMentor Bio:\n${mentor.bio}\n\nSelected Slot: ${req.body.slot}\n\nThank you for choosing our mentorship program.\n\nBest Regards,\nConfio Team`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error sending email:', err);
        return res.status(500).json({ error: 'Failed to send confirmation email' });
      } else {
        console.log('Email sent:', info.response);
        return res.status(200).json({ message: 'Successfully registered and confirmation email sent.' });
      }
    });

  } catch (error) {
    console.error('Error during mentor registration:', error);
    res.status(500).json({ error: 'Failed to register user with mentor' });
  }
});


module.exports = router;
