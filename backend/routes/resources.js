const express = require('express');
const router = express.Router();
require('dotenv').config();

app.get('/api/resources', (req, res) => {
    const query = 'SELECT * FROM resources';
    
    db.query(query, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error fetching resources' });
      }
      res.json(results);
    });
});

module.exports = router;