const express = require('express');
const Conference = require('../models/Conference'); // Import the Conference modelconst router = express.Router();
const router = express.Router();


router.post('/', async (req, res) => {
    const { name, date, location } = req.body;
  
    if (!name || !date || !location) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    try {
      // Create a new conference using the model
      const newConference = await Conference.create({
        name,
        date,
        location,
      });
  
      res.status(201).json({ message: 'Conference added successfully', conference: newConference });
    } catch (err) {
      console.error('Error adding conference:', err);
      res.status(500).json({ error: 'Failed to add conference' });
    }
  });
  
module.exports = router;
