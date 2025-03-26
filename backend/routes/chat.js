const express = require('express');
const { Op } = require('sequelize');
const Message = require('../models/Message');
const User = require('../models/User');
const router = express.Router();

router.get('/users', async (req, res) => {
  const userId = req.query.userId; 
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'role'],
      where: {
        id: {
          [Op.ne]: userId, 
        },
      },
    });
    res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get('/messages/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const senderId = req.query.senderId;
  
      if (!senderId) {
        return res.status(400).json({ error: 'Sender ID is required' });
      }
  
      console.log(`Fetching messages between senderId: ${senderId} and receiverId: ${userId}`);
  
      const messages = await Message.findAll({
        where: {
          [Op.or]: [
            { senderId, receiverId: userId },
            { senderId: userId, receiverId: senderId },
          ],
        },
        order: [['createdAt', 'ASC']],
      });
      res.json({ messages });
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  });


  router.post('/messages', async (req, res) => {
    try {
      const { senderId, receiverId, text } = req.body;
  
      if (!senderId || !receiverId || !text) {
        return res.status(400).json({ error: 'All fields are required' });
      }
  
      const newMessage = await Message.create({
        senderId,
        receiverId,
        text,
      });
  
      res.status(201).json({ message: 'Message sent successfully', newMessage });
    } catch (error) {
      console.error('Error saving message:', error);
      res.status(500).json({ error: 'Failed to save message' });
    }
  });

module.exports = router;