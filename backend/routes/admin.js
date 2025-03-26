const express = require('express');
const router = express.Router();
const db = require('../config/database'); // Assuming you have a DB connection module

// API route to get all conferences
router.get('/api/conferences', (req, res) => {
    const query = 'SELECT * FROM conference';
    db.query(query, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching conferences' });
      }
      res.status(200).json(result);
    });
});
  
// API route to add a new conference
router.post('/api/addconferences', (req, res) => {
    const { name, date, location } = req.body;
  
    if (!name || !date || !location) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    const query = 'INSERT INTO conference (name, date, location) VALUES (?, ?, ?)';
    db.query(query, [name, date, location], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Error adding new conference' });
      }
      res.status(201).json({ message: 'Conference added successfully' });
    });
});

module.exports = router;
