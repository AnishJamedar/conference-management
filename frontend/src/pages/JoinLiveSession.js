import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import './JoinLiveSession.css';

const JoinLiveSession = () => {
  const { id: sessionId, conferenceType } = useParams();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [session, setSession] = useState(null);
  const [username, setUsername] = useState('Guest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const socket = useRef(null);

  useEffect(() => {
    // Get the userId from localStorage
    const userId = localStorage.getItem('userId');
    console.log('Retrieved userId from localStorage:', userId);

    if (!userId) {
      setError('User ID not found. Please log in again.');
      return;
    }

    // Fetch the username
    const fetchUsername = async () => {
      try {
        const response = await fetch(`http://localhost:5001/auth/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch username');
        const data = await response.json();
        setUsername(data.username); // Set username for display
      } catch (err) {
        console.error('Error fetching username:', err);
        setError('Failed to fetch username. Please try again.');
      }
    };

    fetchUsername();
  }, []);

  useEffect(() => {
    // Fetch session details
    const fetchSession = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5001/api/live-sessions/${conferenceType}`);
        if (!response.ok) throw new Error('Failed to load session details');
        const data = await response.json();
        const selectedSession = data.find((s) => s.id === parseInt(sessionId));
        if (!selectedSession) throw new Error('Session not found');
        setSession(selectedSession);
      } catch (err) {
        console.error('Error fetching session details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId, conferenceType]);

  useEffect(() => {
    // Initialize the socket connection
    socket.current = io('http://localhost:5001');

    // Join the session-specific room
    socket.current.emit('join_session', sessionId);

    // Fetch previous messages from the database and enrich with usernames
    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/livechat/${sessionId}`);
        if (!response.ok) throw new Error('Failed to fetch chat messages');
        const data = await response.json();

        // Enrich messages with usernames
        const enrichedMessages = await Promise.all(
          data.map(async (msg) => {
            try {
              const userResponse = await fetch(`http://localhost:5001/auth/${msg.userId}`);
              if (!userResponse.ok) throw new Error('Failed to fetch username');
              const userData = await userResponse.json();
              return { ...msg, username: userData.username };
            } catch {
              return { ...msg, username: `User-${msg.userId}` };
            }
          })
        );

        setMessages(enrichedMessages); // Load enriched messages into state
      } catch (err) {
        console.error('Error fetching messages from database:', err);
      }
    };

    fetchMessages();

    // Listen for new messages in real-time
    socket.current.on('receive_message', async (newMessage) => {
      try {
        const userResponse = await fetch(`http://localhost:5001/auth/${newMessage.userId}`);
        if (!userResponse.ok) throw new Error('Failed to fetch username');
        const userData = await userResponse.json();
        newMessage.username = userData.username;
      } catch {
        newMessage.username = `User-${newMessage.userId}`;
      }
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      // Clean up WebSocket connection
      if (socket.current) socket.current.disconnect();
    };
  }, [sessionId]);

  const handleSendMessage = () => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      alert('User ID not found. Please log in again.');
      return;
    }

    if (message.trim()) {
      const newMessage = { sessionId, userId, username, message };

      // Send message through WebSocket
      socket.current.emit('send_message', newMessage);

      // Clear the input field
      setMessage('');
    } else {
      alert('Message cannot be empty.');
    }
  };

  if (loading) {
    return <p>Loading session details...</p>;
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <Link to="/">Go back to the Virtual Conference page</Link>
      </div>
    );
  }

  return (
    <div className="main-content">
      <h1>{session.title}</h1>
      <p>
        <strong>Speaker:</strong> {session.speaker}
      </p>
      <p>
        <strong>Time:</strong> {session.time}
      </p>
      <p>
        <strong>Description:</strong> {session.description}
      </p>

      <div className="video-box">
        {session.youtube_link ? (
          <iframe
            width="100%"
            height="400"
            src={`https://www.youtube.com/embed/${session.youtube_link}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="YouTube Live Stream"
          ></iframe>
        ) : (
          <p>Live video unavailable.</p>
        )}
      </div>

      <div className="chat-section">
        <h3>Live Chat</h3>
        <div className="chat-box">
          {messages.length === 0 ? (
            <p>No messages yet. Be the first to send a message!</p>
          ) : (
            messages.map((msg, index) => (
              <p key={index}>
                <strong>{msg.username}:</strong> {msg.message}
              </p>
            ))
          )}
        </div>
        <div className="chat-input">
          <p>
            Sending as: <strong>{username}</strong>
          </p>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default JoinLiveSession;
