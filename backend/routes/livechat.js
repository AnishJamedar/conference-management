const express = require('express');
const router = express.Router();
const db = require('../db'); // Assuming you have a db.js for MySQL connection

// Route to fetch chat messages for a live session
router.get('/:sessionId', async (req, res) => {
    const { sessionId } = req.params;

    try {
        const [rows] = await db.execute(
            `SELECT username, message, created_at 
             FROM livechat 
             WHERE session_id = ? 
             ORDER BY created_at ASC`,
            [sessionId]
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching chat messages.');
    }
});

// Route to post a new chat message
router.post('/:sessionId', async (req, res) => {
    const { sessionId } = req.params;
    const { userId, message } = req.body;

    if (!userId || !message) {
        return res.status(400).send('UserId and message are required.');
    }

    try {
        // Fetch the username using the userId (this can be modified as needed)
        const [userResult] = await db.execute(`SELECT username FROM users WHERE id = ?`, [userId]);

        if (userResult.length === 0) {
            return res.status(404).send('User not found.');
        }

        const username = userResult[0].username;

        await db.execute(
            `INSERT INTO livechat (session_id, user_id, username, message, created_at) 
             VALUES (?, ?, ?, ?, NOW())`,
            [sessionId, userId, username, message]
        );

        res.status(201).send('Message posted successfully.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error posting chat message.');
    }
});

module.exports = router;
