import React, { useState, useEffect } from 'react';
import './Mentorship.css';

const Mentorship = () => {
  const [conferences, setConferences] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [selectedConference, setSelectedConference] = useState('');
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch conferences
        const conferenceRes = await fetch('http://localhost:5001/api/conferences');
        if (conferenceRes.ok) {
          setConferences(await conferenceRes.json());
        } else {
          throw new Error('Failed to fetch conferences');
        }

        // Fetch mentors
        const mentorRes = await fetch('http://localhost:5001/api/mentors');
        if (mentorRes.ok) {
          setMentors(await mentorRes.json());
        } else {
          throw new Error('Failed to fetch mentors');
        }

        // Fetch user email
        const userId = localStorage.getItem('userId');
        if (userId) {
          const userRes = await fetch(`http://localhost:5001/auth/${userId}`);
          if (userRes.ok) {
            setUserEmail((await userRes.json()).email);
          } else {
            throw new Error('Failed to fetch user email');
          }
        } else {
          setErrorMessage('User is not logged in. Please log in to register.');
        }
      } catch (error) {
        console.error(error.message);
        setErrorMessage(error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedConference) {
      setFilteredMentors(mentors.filter((mentor) => mentor.conference_id === parseInt(selectedConference)));
    } else {
      setFilteredMentors([]);
    }
  }, [selectedConference, mentors]);

  const handleRegister = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!selectedSlot) {
      setErrorMessage('Please select a time slot before registering.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/registerMentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          mentorId: selectedMentor.id,
          slot: selectedSlot,
        }),
      });

      if (response.ok) {
        setSuccessMessage(`Successfully registered under mentor: ${selectedMentor.name} for slot ${selectedSlot}`);
        setSelectedMentor(null); // Reset view
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error registering under mentor:', error);
      setErrorMessage('An error occurred during registration. Please try again.');
    }
  };

  return (
    <div className="mentorship-page">
      <div className="main-content">
        <header>
          <h1>Connect with a Mentor</h1>
          <p>Sign up for mentorship sessions with industry experts and enhance your career or academic journey.</p>
        </header>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <section>
          <label>
            Select Conference:
            <select value={selectedConference} onChange={(e) => setSelectedConference(e.target.value)}>
              <option value="">-- Select a Conference --</option>
              {conferences.map((conference) => (
                <option key={conference.id} value={conference.id}>
                  {conference.name}
                </option>
              ))}
            </select>
          </label>
        </section>

        {!selectedMentor ? (
          <section>
            <h2>Available Mentors</h2>
            {selectedConference ? (
              filteredMentors.length > 0 ? (
                <table className="schedule-table">
                  <thead>
                    <tr>
                      <th>Mentor Name</th>
                      <th>Bio</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMentors.map((mentor) => (
                      <tr key={mentor.id}>
                        <td>{mentor.name}</td>
                        <td>{mentor.bio}</td>
                        <td>
                          <button className="details-button" onClick={() => setSelectedMentor(mentor)}>
                            View Profile
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No mentors available for the selected conference.</p>
              )
            ) : (
              <p>Please select a conference to view available mentors.</p>
            )}
          </section>
        ) : (
          <section className="mentor-profile">
            <h2>Mentor Profile: {selectedMentor.name}</h2>
            <p><strong>Bio:</strong> {selectedMentor.bio}</p>
            <label>
              Select a Time Slot:
              <select value={selectedSlot} onChange={(e) => setSelectedSlot(e.target.value)}>
                <option value="">-- Select a Slot --</option>
                <option value={selectedMentor.available_datetime1}>
                  {new Date(selectedMentor.available_datetime1).toLocaleString()}
                </option>
                <option value={selectedMentor.available_datetime2}>
                  {new Date(selectedMentor.available_datetime2).toLocaleString()}
                </option>
              </select>
            </label>
            <form className="mentorship-form" onSubmit={handleRegister}>
              <button type="submit">Register with this Mentor</button>
            </form>
            <button className="back-button" onClick={() => setSelectedMentor(null)}>
              Back to Mentors
            </button>
          </section>
        )}
      </div>
    </div>
  );
};

export default Mentorship;
