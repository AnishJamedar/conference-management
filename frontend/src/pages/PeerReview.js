import React, { useState, useEffect } from 'react';
import './PeerReview.css';

const PeerReview = () => {
  const [submissions, setSubmissions] = useState([]);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [reviewFeedback, setReviewFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [error, setError] = useState('');
  const [expertise, setExpertise] = useState('');
  const [conferenceName, setConferenceName] = useState('');
  const [usernames, setUsernames] = useState({});

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    console.log('Retrieved userId from localStorage:', userId);

    if (!userId) {
      setError('User ID not found. Please log in again.');
      return;
    }

    const fetchUserExpertise = async () => {
      try {
        const userResponse = await fetch(`http://localhost:5001/auth/${userId}`);
        if (!userResponse.ok) throw new Error('Failed to fetch user data');
        const userData = await userResponse.json();
        console.log('Response from /auth/:userId:', userData);

        const userExpertise = userData.expertise;
        if (userExpertise) {
          console.log('Expertise retrieved:', userExpertise);
          setExpertise(userExpertise);
          
          // Fetch all conferences
          const conferenceResponse = await fetch('http://localhost:5001/api/conferences');
          if (!conferenceResponse.ok) throw new Error('Failed to fetch conferences');
          const conferences = await conferenceResponse.json();
          
          // Find the matching conference
          const matchingConference = conferences.find(conf => conf.id === parseInt(userExpertise));
          if (matchingConference) {
            setConferenceName(matchingConference.name);
          } else {
            console.warn('No matching conference found for expertise:', userExpertise);
          }
        } else {
          throw new Error('Expertise not found for the user');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch user expertise or conference name');
      }
    };

    fetchUserExpertise();
  }, []);

  const fetchUsernames = async (submissions) => {
    const usernamePromises = submissions.map(async (submission) => {
      try {
        const response = await fetch(`http://localhost:5001/auth/${submission.userId}`);
        if (!response.ok) throw new Error('Failed to fetch user data');
        const userData = await response.json();
        return { userId: submission.userId, username: userData.username };
      } catch (err) {
        console.error(`Error fetching username for user ${submission.userId}:`, err);
        return { userId: submission.userId, username: 'Unknown' };
      }
    });

    const usernameResults = await Promise.all(usernamePromises);
    const usernameMap = Object.fromEntries(
      usernameResults.map(({ userId, username }) => [userId, username])
    );
    setUsernames(usernameMap);
  };

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!expertise) return;

      try {
        const response = await fetch(`http://localhost:5001/api/submissions/conference/${expertise}`);
        if (!response.ok) throw new Error('Failed to load submissions');
        const submissionsData = await response.json();
        console.log(submissionsData);
        setSubmissions(submissionsData);
        fetchUsernames(submissionsData);
      } catch (err) {
        console.error(err);
        setError('Failed to load submissions. Please try again later.');
      }
    };

    fetchSubmissions();
  }, [expertise]);

  const handleView = (paper) => {
    setSelectedPaper(paper);
  };

  const handleReviewSubmit = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch('http://localhost:5001/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submission_id: selectedPaper.id,
          reviewer_id: userId,
          rating,
          feedback: reviewFeedback,
        }),
      });

      if (response.ok) {
        alert('Review submitted successfully. An email has been sent to the author.');
        setSelectedPaper(null);
        setReviewFeedback('');
        setRating(0);
      } else {
        setError('Failed to submit review');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred while submitting the review');
    }
  };

  return (
    <div className="pr-page-layout">
      <div className="pr-content">
        <h1>Peer Review Dashboard</h1>
        {expertise && conferenceName && (
          <h2>Expertise: {conferenceName} </h2>
        )}
        {error && <p className="error-message">{error}</p>}

        {!selectedPaper ? (
          <section>
            <h2>Assigned Papers</h2>
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>File</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => (
                  <tr key={submission.id}>
                    <td>{submission.title}</td>
                    <td>
                      {usernames[submission.userId] || 'Loading...'}
                    </td>
                    <td>
                      <a
                        href={`http://localhost:5001/${submission.filePath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View File
                      </a>
                    </td>
                    <td>
                      <button
                        className="details-button"
                        onClick={() => handleView(submission)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ) : (
          <div>
            <h2>Review Paper: {selectedPaper.title}</h2>
            <p>
              <strong>Author:</strong> {selectedPaper.userId}
              <br />
              <small>{usernames[selectedPaper.userId] || 'Unknown'}</small>
            </p>

            <div className="rating-system">
              <label>Rate the submission:</label>
              <select
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
              >
                <option value="0">Select Rating</option>
                {[1, 2, 3, 4, 5].map((score) => (
                  <option key={score} value={score}>
                    {score}
                  </option>
                ))}
              </select>
            </div>

            <div className="feedback-section">
              <label>Write your feedback:</label>
              <textarea
                rows="5"
                placeholder="Provide detailed feedback for the paper"
                value={reviewFeedback}
                onChange={(e) => setReviewFeedback(e.target.value)}
                required
              ></textarea>
            </div>

            <button className="details-button" onClick={handleReviewSubmit}>
              Submit Review
            </button>
            <button className="back-button" onClick={() => setSelectedPaper(null)}>
              Back to List
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PeerReview;
