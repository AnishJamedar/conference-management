const db = require('./config/database'); // Database connection setup

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // User joins a specific session room
    socket.on('join_session', (sessionId) => {
      socket.join(sessionId);
      console.log(`User joined session: ${sessionId}`);
    });

    // Handle sending messages
    socket.on('send_message', (newMessage) => {
      const { sessionId, userId, username, message } = newMessage;

      // Broadcast the message to all users in the same room
      io.to(sessionId).emit('receive_message', newMessage);

      // Save the message to the database (optional)
      db.query(
        `INSERT INTO livechat (session_id, user_id, username, message, created_at) VALUES (?, ?, ?, ?, NOW())`,
        [sessionId, userId, username, message],
        (err, result) => {
          if (err) {
            console.error('Database error:', err);
          } else {
            console.log('Message saved to database:', result);
          }
        }
      );
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

module.exports = socketHandler;
