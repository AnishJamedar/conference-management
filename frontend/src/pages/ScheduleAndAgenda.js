import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import './ScheduleAndAgenda.css';

const ScheduleAndAgenda = () => {
  const [conferences, setConferences] = useState([]);
  const [selectedConference, setSelectedConference] = useState('');
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [error, setError] = useState('');

  // Fetch conferences dynamically
  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/conferences');
        if (!response.ok) throw new Error('Failed to load conferences');
        const data = await response.json();
        setConferences(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load conferences. Please try again later.');
      }
    };

    fetchConferences();
  }, []);

  // Fetch sessions dynamically based on the selected conference
  useEffect(() => {
    const fetchSessions = async () => {
      if (!selectedConference) return;

      try {
        const response = await fetch(`http://localhost:5001/api/conference-sessions/${selectedConference}`);
        if (!response.ok) throw new Error('Failed to load sessions');
        const data = await response.json();
        setSessions(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load sessions. Please try again later.');
      }
    };

    fetchSessions();
  }, [selectedConference]);

  const handleViewDetails = (session) => {
    setSelectedSession(session);
  };

  const handleBack = () => {
    setSelectedSession(null);
  };

  const handleExportSchedule = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Conference Schedule & Agenda', 10, 10);

    let yPosition = 20;

    sessions.forEach((session) => {
      doc.setFontSize(12);
      doc.text(`Day: ${session.day} - ${session.track}`, 10, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.text(`Time: ${session.time}`, 10, yPosition);
      yPosition += 5;
      doc.text(`Session: ${session.title}`, 10, yPosition);
      yPosition += 5;
      doc.text(`Speaker: ${session.speaker}`, 10, yPosition);
      yPosition += 5;
      doc.text(`Expertise: ${session.expertise}`, 10, yPosition);
      yPosition += 10;

      if (yPosition > 280) {
        doc.addPage();
        yPosition = 10;
      }
    });

    doc.save('conference_schedule.pdf');
  };

  return (
    <div className="main-content-container">
      <div className="main-content">
        <header>
          <h1>Conference Schedule & Agenda</h1>
          <p>Check out the full schedule and plan your sessions.</p>
          <button className="export-button" onClick={handleExportSchedule}>
            Export Schedule
          </button>
        </header>

        <section style={{ marginTop: '20px' }}>
          <label>Select Conference:</label>
          <select
            value={selectedConference}
            onChange={(e) => setSelectedConference(e.target.value)}
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

        {!selectedSession ? (
          sessions.length > 0 ? (
            <section>
              <h2>Sessions for Selected Conference</h2>
              <table className="schedule-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Session Title</th>
                    <th>Speaker</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((session, index) => (
                    <tr key={index}>
                      <td>{session.time}</td>
                      <td>{session.title}</td>
                      <td>{session.speaker}</td>
                      <td>
                        <button
                          className="details-button"
                          onClick={() => handleViewDetails(session)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          ) : (
            <p>No sessions available for this conference.</p>
          )
        ) : (
          <div className="session-details">
            <h2>Speaker Profile: {selectedSession.speaker}</h2>
            <p>
              <strong>Expertise:</strong> {selectedSession.expertise}
            </p>
            <p>
              <strong>Education:</strong> {selectedSession.education}
            </p>
            <p>
              <strong>Bio:</strong> {selectedSession.bio}
            </p>

            <h3>Session: {selectedSession.title}</h3>
            <p>{selectedSession.description}</p>

            <button className="back-button" onClick={handleBack}>
              Back to Schedule
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleAndAgenda;
