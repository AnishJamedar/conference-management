import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './VirtualConference.css';

const VirtualConference = () => {
  const [conferences, setConferences] = useState([]);
  const [selectedConference, setSelectedConference] = useState('');
  const [liveSessions, setLiveSessions] = useState([]);
  const [recordedSessions, setRecordedSessions] = useState([]);
  const [error, setError] = useState('');

  // Fetch conferences dynamically
  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/conferences');
        if (!response.ok) throw new Error('Failed to load conferences');
        const data = await response.json();
        setConferences(data);
        setSelectedConference(data[0]?.id || ''); // Set the first conference as default
      } catch (err) {
        console.error(err);
        setError('Failed to load conferences. Please try again later.');
      }
    };

    fetchConferences();
  }, []);

  // Fetch live and recorded sessions dynamically
  useEffect(() => {
    if (!selectedConference) return;

    const fetchSessions = async () => {
      try {
        const liveResponse = await fetch(`http://localhost:5001/api/live-sessions/${selectedConference}`);
        const recordedResponse = await fetch(`http://localhost:5001/api/recorded-sessions/${selectedConference}`);

        if (!liveResponse.ok || !recordedResponse.ok) {
          throw new Error('Failed to load sessions');
        }

        const liveData = await liveResponse.json();
        const recordedData = await recordedResponse.json();

        setLiveSessions(liveData);
        setRecordedSessions(recordedData);
      } catch (err) {
        console.error(err);
        setError('Failed to load sessions. Please try again later.');
      }
    };

    fetchSessions();
  }, [selectedConference]);

  return (
    <div>
      <div className="main-content">
        <header>
          <h1>Join the Virtual Conference</h1>
          <p>Select a conference to view live and recorded sessions!</p>
        </header>

        <section>
          <h2>Select Conference</h2>
          <select
            value={selectedConference}
            onChange={(e) => setSelectedConference(e.target.value)}
            className="conference-select"
          >
            <option value="">-- Select Conference --</option>
            {conferences.map((conf) => (
              <option key={conf.id} value={conf.id}>
                {conf.name}
              </option>
            ))}
          </select>
        </section>

        {error && <p className="error-message">{error}</p>}

        <section>
          <h2>Live Sessions</h2>
          <table className="conference-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Session Title</th>
                <th>Speaker</th>
                <th>Join</th>
              </tr>
            </thead>
            <tbody>
              {liveSessions.length > 0 ? (
                liveSessions.map((session) => (
                  <tr key={session.id}>
                    <td>{session.time}</td>
                    <td>{session.title}</td>
                    <td>{session.speaker}</td>
                    <td>
                      <Link to={`/join-live-session/${selectedConference}/${session.id}`}>
                        <button className="details-button">Join Now</button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No live sessions available for this conference.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        <section>
          <h2>Recorded Sessions</h2>
          <table className="conference-table">
            <thead>
              <tr>
                <th>Session Title</th>
                <th>Status</th>
                <th>Watch</th>
              </tr>
            </thead>
            <tbody>
              {recordedSessions.length > 0 ? (
                recordedSessions.map((session) => (
                  <tr key={session.id}>
                    <td>{session.title}</td>
                    <td>{session.watched ? 'Watched' : 'Not Watched'}</td>
                    <td>
                      <a href={session.link} target="_blank" rel="noopener noreferrer">
                        Watch Now
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No recorded sessions available for this conference.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default VirtualConference;
