import React, { useState, useEffect } from 'react';
import './SubmissionsPortal.css';

const SubmissionsPortal = () => {
  const [formData, setFormData] = useState({
    title: '',
    file: null,
    conference_id: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [conferences, setConferences] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    // Fetch conferences from the backend
    const fetchConferences = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/conferences');
        if (response.ok) {
          const data = await response.json();
          setConferences(data);
        } else {
          console.error('Failed to fetch conferences');
        }
      } catch (error) {
        console.error('Error fetching conferences:', error);
      }
    };

    fetchConferences();

    // Fetch user email and userId from the backend
    const fetchUserDetails = async () => {
      const storedUserId = localStorage.getItem('userId');
      if (!storedUserId) {
        setErrorMessage('User is not logged in. Please log in to submit.');
        return;
      }
      setUserId(storedUserId);

      try {
        const response = await fetch(`http://localhost:5001/auth/${storedUserId}`);
        if (response.ok) {
          const data = await response.json();
          setUserEmail(data.email); // Set the user's email
        } else {
          console.error('Failed to fetch user email');
        }
      } catch (error) {
        console.error('Error fetching user email:', error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userEmail || !userId) {
      setErrorMessage('Failed to fetch user details. Please try again.');
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('userId', userId); // Use userId instead of author name
    data.append('email', userEmail); // Use the fetched email
    data.append('file', formData.file);
    data.append('conference_id', formData.conference_id);

    try {
      const response = await fetch('http://localhost:5001/api/submissions', {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        setSuccessMessage('Your paper has been submitted successfully! You will receive a confirmation email shortly.');
        setFormData({
          title: '',
          file: null,
          conference_id: '',
        });
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to submit the paper. Please try again.');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again later.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  return (
    <div className="main-content">
      <header>
        <h1>Submissions Portal</h1>
        <p>Submit your paper to the relevant conference track.</p>
      </header>

      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <form onSubmit={handleSubmit}>
        <label>
          Select Conference:
          <select
            name="conference_id"
            value={formData.conference_id}
            onChange={handleChange}
            required
          >
            <option value="">--Select Conference--</option>
            {conferences.map((conference) => (
              <option key={conference.id} value={conference.id}>
                {conference.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Paper Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Upload Paper:
          <input
            type="file"
            name="file"
            onChange={handleFileChange}
            required
          />
        </label>

        <button type="submit">Submit Paper</button>
      </form>
    </div>
  );
};

export default SubmissionsPortal;
