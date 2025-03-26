require('dotenv').config();

const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const userRoutes = require('./routes/auth');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', userRoutes);

sequelize.sync()
  .then(() => {
    console.log('Database synced with updated structure');
  })
  .catch((err) => console.error('Error syncing database', err));

const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Live chat with session-specific rooms
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Join a specific session room
  socket.on('join_session', async (sessionId) => {
    socket.join(sessionId);
    console.log(`User joined session: ${sessionId}`);

    // Fetch existing messages from the database
    try {
      const [messages] = await sequelize.query(
        `SELECT username, message, created_at 
         FROM LiveChat 
         WHERE session_id = ? 
         ORDER BY created_at ASC`,
        { replacements: [sessionId] }
      );

      // Send existing messages to the user who joined
      socket.emit('load_messages', messages);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  });

  // Handle incoming messages
  socket.on('send_message', async (message) => {
    console.log('Message received:', message);

    const { sessionId, userId, username, message: msgText } = message;

    // Broadcast message to the room
    io.to(sessionId).emit('receive_message', message);

    // Save the message to the database
    try {
      await sequelize.query(
        `INSERT INTO LiveChat (session_id, user_id, username, message, created_at) VALUES (?, ?, ?, ?, NOW())`,
        { replacements: [sessionId, userId, username, msgText] }
      );
      console.log('Message saved to database.');
    } catch (err) {
      console.error('Error saving message to database:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Routes
const submissionsRoute = require('./routes/submissions');
app.use('/api/submissions', submissionsRoute);

const reviewsRoute = require('./routes/reviews');
app.use('/api/reviews', reviewsRoute);

const registrationsRoute = require('./routes/registrations');
app.use('/api/registrations', registrationsRoute);

const contactRoute = require('./routes/contact');
app.use('/api/contact', contactRoute);

const chatRoute = require('./routes/chat');
app.use('/api/chat', chatRoute);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const mentorsRoutes = require('./routes/mentors'); 
app.use('/api', mentorsRoutes); // Mount mentors routes under /api

const addConferenceRoute = require('./routes/addconference'); // Correct path to your route
app.use('/api/addconferences', addConferenceRoute); // Register the addconference route under /api

// Conference-related routes
app.get('/api/conferences', async (req, res) => {
  try {
    const [results] = await sequelize.query('SELECT id, name FROM Conference');
    res.json(results);
  } catch (err) {
    console.error('Error fetching conferences:', err);
    res.status(500).json({ error: 'Failed to fetch conferences' });
  }
});

app.get('/api/conference-sessions/:conferenceId', async (req, res) => {
  const { conferenceId } = req.params;
  try {
    const [sessions] = await sequelize.query(
      `SELECT day, track, time, title, speaker, bio, education, expertise, description 
       FROM Sessions 
       WHERE conference_id = ?`,
      { replacements: [conferenceId] }
    );

    if (!sessions || sessions.length === 0) {
      return res.status(404).json({ error: 'No sessions found for this conference' });
    }

    res.json(sessions);
  } catch (err) {
    console.error('Error fetching sessions:', err);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

app.get('/api/live-sessions/:conferenceId', async (req, res) => {
  const { conferenceId } = req.params;
  try {
    const [liveSessions] = await sequelize.query(
      `SELECT id, time, title, speaker, youtube_link 
       FROM LiveSessions 
       WHERE conference_id = ?`,
      { replacements: [conferenceId] }
    );

    res.json(liveSessions);
  } catch (err) {
    console.error('Error fetching live sessions:', err);
    res.status(500).json({ error: 'Failed to fetch live sessions' });
  }
});

app.get('/api/recorded-sessions/:conferenceId', async (req, res) => {
  const { conferenceId } = req.params;
  try {
    const [recordedSessions] = await sequelize.query(
      `SELECT id, title, watched, link FROM RecordedSessions WHERE conference_id = ?`,
      { replacements: [conferenceId] }
    );

    res.json(recordedSessions);
  } catch (err) {
    console.error('Error fetching recorded sessions:', err);
    res.status(500).json({ error: 'Failed to fetch recorded sessions' });
  }
});

app.get('/api/resources', async (req, res) => {
  try {
    const [resources] = await sequelize.query('SELECT title, description, link FROM Resources');
    res.json(resources);
  } catch (err) {
    console.error('Error fetching resources:', err);
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

app.get('/api/livechat/:sessionId', async (req, res) => {
  const { sessionId } = req.params;

  try {
    const [rows] = await sequelize.query(
      `SELECT username, message, created_at 
       FROM LiveChat 
       WHERE session_id = ? 
       ORDER BY created_at ASC`,
      { replacements: [sessionId] }
    );

    res.json(rows);
  } catch (err) {
    console.error('Error fetching chat messages:', err);
    res.status(500).send('Error fetching chat messages.');
  }
});

app.get('/api/jobs', async (req, res) => {
  try {
    const [jobs] = await sequelize.query(`
      SELECT Jobs.id, Jobs.title, Jobs.company, Jobs.location, Jobs.description, Jobs.applyLink, Conference.name AS conference
      FROM Jobs
      JOIN Conference ON Jobs.conference_id = Conference.id
    `);

    const jobBoard = jobs.reduce((acc, job) => {
      if (!acc[job.conference]) {
        acc[job.conference] = [];
      }
      acc[job.conference].push(job);
      return acc;
    }, {});

    res.json(jobBoard);
  } catch (err) {
    console.error('Error fetching jobs:', err);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});