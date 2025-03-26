const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const multer = require('multer');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  host: 'in-v3.mailjet.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  logger: true,
  debug: true,
});

// Submission Route
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { title, userId, conference_id } = req.body; // Fetch userId from the body
    const filePath = req.file ? req.file.path : null;

    // Ensure file is uploaded
    if (!filePath) {
      return res.status(400).json({ error: 'File is required' });
    }

    // Ensure userId is defined
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Create the submission in the database
    const submission = await Submission.create({
      title,
      userId, // Use userId instead of author
      filePath,
      conference_id,
    });

    // Send response
    res.status(201).json({ message: 'Submission created successfully', submission });

    // Send confirmation email
    const mailOptions = {
      from: '"Confio Conference" <samyakjain720@gmail.com>',
      to: email,
      subject: 'Paper Submission Confirmation',
      text: `Dear User,\n\nYour paper titled "${title}" has been successfully submitted to the conference. Thank you for your submission!\n\nBest Regards,\nConfio Conference Team`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error sending email:', err);
      } else {
        console.log('Email sent:', info.response);
      }
    });

  } catch (error) {
    console.error('Error during submission:', error);
    res.status(500).json({ error: 'Failed to create submission' });
  }
});
router.get('/conference/:conference_id', async (req, res) => {
  const { conference_id } = req.params;
  try {
    const submissions = await Submission.findAll({ where: { conference_id } });
    res.json(submissions); 
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});

module.exports = router;