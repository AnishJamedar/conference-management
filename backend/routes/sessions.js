const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');

router.get('/:conferenceId', async (req, res) => {
  const { conferenceId } = req.params;

  try {
    const [sessions] = await sequelize.query(
      `SELECT day, track, time, title, speaker, bio, education, expertise, description, youtube-link
       FROM Sessions 
       WHERE conference_id = ?`,
      { replacements: [conferenceId] }
    );

    if (sessions.length === 0) {
      return res.status(404).json({ error: 'No sessions found for this conference' });
    }

    res.json(sessions);
  } catch (err) {
    console.error('Error fetching sessions:', err);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

module.exports = router;
