const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Submission = require('../models/Submission');
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: "in-v3.mailjet.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  logger: true,
  debug: true,
});

router.post('/', async (req, res) => {
  console.log('Received POST /reviews request with body:', req.body);

  try {
    const { submission_id, reviewer_id, rating, feedback } = req.body;

    // Fetch the submission to get the userId (author)
    const submission = await Submission.findByPk(submission_id);
    if (!submission) {
      console.error('Submission not found for ID:', submission_id);
      return res.status(404).json({ error: 'Submission not found' });
    }

    console.log('Fetched submission details:', submission);

    const authorId = submission.userId; // Get the author ID from the submission
    console.log('Author ID:', authorId);

    // Fetch author details using the /auth/:userId endpoint
    const authorResponse = await fetch(`http://localhost:5001/auth/${authorId}`);
    if (!authorResponse.ok) {
      console.error('Failed to fetch author details for ID:', authorId);
      throw new Error('Failed to fetch author details');
    }
    const author = await authorResponse.json();
    console.log('Fetched author details:', author);

    // Fetch the reviewer details
    const reviewerResponse = await fetch(`http://localhost:5001/auth/${reviewer_id}`);
    if (!reviewerResponse.ok) {
      console.error('Failed to fetch reviewer details for ID:', reviewer_id);
      throw new Error('Failed to fetch reviewer details');
    }
    const reviewer = await reviewerResponse.json();
    console.log('Fetched reviewer details:', reviewer);

    // Create the review entry
    const review = await Review.create({
      submission_id,
      reviewer_id,
      rating,
      feedback,
      authorId, // Use the userId as the authorId in the reviews table
    });
    console.log('Review created successfully:', review);

    // Prepare and send the email to the author
    const mailOptions = {
      from: '"Confio Reviews" <samyakjain720@gmail.com>',
      to: author.email, // Author's email fetched from the API
      subject: `Your submission received a review`,
      text: `Dear ${author.username},\n\nYour submission titled "${submission.title}" has been reviewed by ${reviewer.username}.\n\nRating: ${rating}/5\nFeedback: ${feedback}\n\nThank you for your contributions!\n\nBest Regards,\nConfio Team`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error sending email:', err);
      } else {
        console.log('Email sent successfully:', info.response);
      }
    });

    res.status(201).json({ message: 'Review submitted successfully and email notification sent', review });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});


router.put('/:submissionId/status', async (req, res) => {
    try {
      const { submissionId } = req.params;
      const submission = await Submission.findByPk(submissionId);
  
      if (!submission) {
        return res.status(404).json({ error: 'Submission not found' });
      }
  
      submission.status = 'Reviewed';
      await submission.save();
  
      res.json({ message: 'Submission status updated to Reviewed' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update submission status' });
    }
  });

module.exports = router;