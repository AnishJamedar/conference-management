import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css'; // Add this import at the top of your component file
const AdminDashboard = () => {
  const [conferences, setConferences] = useState([]);
  const [newConference, setNewConference] = useState({
    name: '',
    date: '',
    location: '',
  });
  const [editingConference, setEditingConference] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  // Fetch existing conferences from the backend
  const fetchConferences = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/conferences');
      const data = await response.json();
      setConferences(data);
      setError('');
    } catch (err) {
      setError('Failed to load conferences');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConferences();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewConference({
      ...newConference,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newConference.name || !newConference.date || !newConference.location) {
      setError('All fields are required');
      return;
    }

    console.log('Submitting new conference:', newConference); // Debugging: Log new conference data

    try {
      const response = await fetch('http://localhost:5001/api/addconferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newConference),
      });

      console.log('Response from adding conference:', response); // Debugging: Log the fetch response

      const data = await response.json();
      console.log('Response data:', data); // Debugging: Log the parsed response data

      if (response.ok) {
        setNewConference({ name: '', date: '', location: '' });
        setSuccessMessage('Conference added successfully!');
        fetchConferences();
      } else {
        setError(data.error || 'Error adding conference');
      }
    } catch (error) {
      console.error('Error occurred during submission:', error); // Debugging: Log any error
      setError('An error occurred. Please try again later.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editingConference.name || !editingConference.date || !editingConference.location) {
      setError('All fields are required');
      return;
    }

    console.log('Updating conference:', editingConference); // Debugging: Log editing conference data

    try {
      const response = await fetch(
        `http://localhost:5001/api/conferences/${editingConference.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingConference),
        }
      );

      console.log('Response from updating conference:', response); // Debugging: Log the fetch response

      if (response.ok) {
        setEditingConference(null);
        setSuccessMessage('Conference updated successfully!');
        fetchConferences();
      } else {
        setError('Error updating conference');
      }
    } catch (err) {
      console.error('Error occurred during update:', err); // Debugging: Log any error
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      {loading ? (
        <p>Loading conferences...</p>
      ) : (
        <>
          <h3>Existing Conferences</h3>
          <ul>
            {conferences.map((conference) => (
              <li key={conference.id}>
                {conference.name} - {conference.date} - {conference.location}{' '}
              </li>
            ))}
          </ul>
        </>
      )}

      <h3>{editingConference ? 'Edit Conference' : 'Add New Conference'}</h3>
      <form onSubmit={editingConference ? handleUpdate : handleSubmit}>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={editingConference ? editingConference.name : newConference.name}
          onChange={(e) =>
            editingConference
              ? setEditingConference({ ...editingConference, name: e.target.value })
              : handleInputChange(e)
          }
          required
        />
        <label>Date</label>
        <input
          type="date"
          name="date"
          value={editingConference ? editingConference.date : newConference.date}
          onChange={(e) =>
            editingConference
              ? setEditingConference({ ...editingConference, date: e.target.value })
              : handleInputChange(e)
          }
          required
        />
        <label>Location</label>
        <input
          type="text"
          name="location"
          value={editingConference ? editingConference.location : newConference.location}
          onChange={(e) =>
            editingConference
              ? setEditingConference({ ...editingConference, location: e.target.value })
              : handleInputChange(e)
          }
          required
        />
        <button type="submit">{editingConference ? 'Update Conference' : 'Add Conference'}</button>
        {editingConference && <button onClick={() => setEditingConference(null)}>Cancel</button>}
      </form>

      {/* Chat Button */}
      <button onClick={() => navigate('/chat')} className="chats-button">
        Go to Chat
      </button>
    </div>
  );
};

export default AdminDashboard;
