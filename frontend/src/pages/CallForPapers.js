import React from 'react';
import './CallForPapers.css';
import { useNavigate } from 'react-router-dom';

const CallForPapers = () => {
  const navigate = useNavigate(); // React Router's navigation hook

  const handleSubmitClick = () => {
    // Navigate to the submission portal or another page
    navigate('/submissions');
  };

  return (
    <div className="cp-page-layout">
      <div className="cp-content">
        <header>
          <h1>Call for Papers</h1>
          <p>Submit your research and join the academic conversation!</p>
          <button className="submit-paper-button" onClick={handleSubmitClick}>
            Submit Your Paper
          </button>
        </header>

        <section>
          <h2>Submission Guidelines</h2>
          <ul>
            <li>Papers must be submitted in PDF format.</li>
            <li>Ensure your paper follows the conference-specific template.</li>
            <li>Papers should not exceed 10 pages, including references.</li>
            <li>You will receive a confirmation email upon successful submission.</li>
            <li>Authors will be notified via email about the review results.</li>
          </ul>
        </section>

        <section>
          <h2>Important Dates</h2>
          <ul>
            <li>Submission Deadline: December 15, 2024</li>
            <li>Notification of Acceptance: January 10, 2025</li>
            <li>Final Paper Due: January 30, 2025</li>
          </ul>
        </section>
      </div> 
      
      <div className="faq2-box">
        <h2>Frequently Asked Questions</h2>
        <ul>
          <li><strong>Q:</strong> What format should my paper be in?<br/><strong>A:</strong> Please submit in PDF format.</li>
          <li><strong>Q:</strong> Is there a template for submission?<br/><strong>A:</strong> Yes, please use the provided template.</li>
          <li><strong>Q:</strong> How many pages can my paper be?<br/><strong>A:</strong> The maximum length is 10 pages, including references.</li>
          <li><strong>Q:</strong> When will I know if my paper is accepted?<br/><strong>A:</strong> Notifications will be sent out by Nov 10, 2024.</li>
          <li><strong>Q:</strong> Can I submit multiple papers?<br/><strong>A:</strong> Yes, you can submit multiple papers.</li>
        </ul>
      </div>     
    </div>
  );
};

export default CallForPapers;
