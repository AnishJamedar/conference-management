import React, { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import './Chat.css';

const socket = io.connect('http://localhost:5001'); 

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]); 
  const [newMessage, setNewMessage] = useState('');
  const [userList, setUserList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userId, setUserId] = useState(null); // Current logged-in user ID

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem('userId');
    if (!userIdFromStorage) {
      console.error('User ID not found in localStorage');
      return;
    }
    setUserId(userIdFromStorage);
  }, []);

  const fetchUsers = async () => {
    if (!userId) {
      console.error('User ID is not found in localStorage');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/chat/users?userId=${userId}`);
      const data = await response.json();
      setUserList(data.users.filter((user) => user.id !== userId));
      setLoadingUsers(false);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [userId]);

  const fetchUsername = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/auth/${id}`);
      if (response.ok) {
        const data = await response.json();
        return data.username;
      } else {
        console.error(`Failed to fetch username for userId: ${id}`);
        return 'Unknown';
      }
    } catch (error) {
      console.error('Error fetching username:', error);
      return 'Unknown';
    }
  };

  const fetchMessages = async (chatUserId) => {
    if (!userId) {
      console.error('Sender ID not found in localStorage');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/chat/messages/${chatUserId}?senderId=${userId}`);
      const data = await response.json();

      // Fetch usernames for sender and receiver
      const enrichedMessages = await Promise.all(
        data.messages.map(async (msg) => {
          const senderUsername = await fetchUsername(msg.senderId);
          const receiverUsername = await fetchUsername(msg.receiverId);

          return {
            ...msg,
            senderUsername,
            receiverUsername,
          };
        })
      );

      setMessages(enrichedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleReceiveMessage = useCallback(
    async (message) => {
      const senderUsername = await fetchUsername(message.senderId);
      const receiverUsername = await fetchUsername(message.receiverId);

      const enrichedMessage = {
        ...message,
        senderUsername,
        receiverUsername,
      };

      if (message.senderId === selectedUser?.id || message.receiverId === selectedUser?.id) {
        setMessages((prevMessages) => [...prevMessages, enrichedMessage]);
      }
    },
    [selectedUser]
  );

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.id);
    }
  }, [selectedUser]);

  useEffect(() => {
    socket.on('receiveMessage', handleReceiveMessage);
    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, [handleReceiveMessage]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && userId && selectedUser) {
      const messageData = {
        senderId: userId,
        receiverId: selectedUser.id,
        text: newMessage,
      };

      try {
        const response = await fetch('http://localhost:5001/api/chat/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(messageData),
        });

        if (response.ok) {
          socket.emit('sendMessage', messageData);

          // Fetch usernames for new message
          const senderUsername = await fetchUsername(messageData.senderId);
          const receiverUsername = await fetchUsername(messageData.receiverId);

          setMessages((prevMessages) => [
            ...prevMessages,
            { ...messageData, senderUsername, receiverUsername },
          ]);

          setNewMessage('');
        } else {
          console.error('Failed to send message');
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <div className="chat-container">
      <div className="user-list">
        <h3>Users</h3>
        {loadingUsers ? (
          <p>Loading users...</p>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {userList.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                  <td>
                    <button className="chat-button" onClick={() => setSelectedUser(user)}>
                      Chat
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedUser && (
        <div className="chat-window">
          <h3>Chat with {selectedUser.username}</h3>
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.senderId === userId ? 'sent' : 'received'}`}
              >
                <span className="message-username">
                  {msg.senderId === userId ? 'You' : msg.senderUsername}:
                </span>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="message-input">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
