import React, { useState, useEffect } from 'react';
import './CareerDevelopment.css';

const CareerDevelopment = () => {
  const [resources, setResources] = useState([]);
  const [jobBoard, setJobBoard] = useState({});
  const [selectedResource, setSelectedResource] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedConference, setSelectedConference] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  // Fetch resources and jobs data
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const resourceResponse = await fetch('http://localhost:5001/api/resources');
        const jobResponse = await fetch('http://localhost:5001/api/jobs');
        
        if (!resourceResponse.ok || !jobResponse.ok) {
          throw new Error('Failed to fetch resources or jobs');
        }

        const resourceData = await resourceResponse.json();
        const jobData = await jobResponse.json();

        setResources(resourceData);
        setJobBoard(jobData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      }
    };

    fetchResources();
  }, []);

  const handleViewDetails = (resource) => {
    setSelectedResource(resource);
  };

  const handleViewJobDetails = (job) => {
    setSelectedJob(job);
  };

  const handleBack = () => {
    setSelectedResource(null);
    setSelectedJob(null);
    setSelectedConference(null);
  };

  const filteredJobs = selectedConference
    ? jobBoard[selectedConference]?.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.location.toLowerCase().includes(searchTerm.toLowerCase())
      ) || []
    : [];

  return (
    <div className="cd-page-layout">
      <div className="main-content">
        <header>
          <h1>Career Development</h1>
          <p>Explore our resources for career advancement, including articles, workshops, webinars, and a job board featuring academic and research opportunities.</p>
        </header>

        {error && <p className="error-message">{error}</p>}

        {!selectedResource && !selectedJob ? (
          <>
            <section>
              <h2>Job Board</h2>
              {!selectedConference ? (
                <div className="conference-list">
                  <h3>Select a Conference to View Available Jobs:</h3>
                  <ul className="conference-links">
                    {Object.keys(jobBoard).map((conference, idx) => (
                      <li key={idx}>
                        <button className="conference-button" onClick={() => setSelectedConference(conference)}>
                          {conference}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Search jobs by title, company, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="job-search-input large-input"
                  />
                  <h3>Jobs for {selectedConference}</h3>
                  {filteredJobs.length > 0 ? (
                    <table className="schedule-table">
                      <thead>
                        <tr>
                          <th>Job Title</th>
                          <th>Company</th>
                          <th>Location</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredJobs.map((job, idx) => (
                          <tr key={idx}>
                            <td>{job.title}</td>
                            <td>{job.company}</td>
                            <td>{job.location}</td>
                            <td>
                              <button className="details-button" onClick={() => handleViewJobDetails(job)}>
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No jobs found matching your search criteria.</p>
                  )}
                  <button className="back-button" onClick={handleBack}>
                    Back to Conference List
                  </button>
                </>
              )}
            </section>

            <hr className="section-divider" />

            <section>
              <h2>Available Resources</h2>
              <table className="schedule-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {resources.map((resource, index) => (
                    <tr key={index}>
                      <td>{resource.title}</td>
                      <td>{resource.description}</td>
                      <td>
                        <button className="details-button" onClick={() => handleViewDetails(resource)}>
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        ) : selectedResource ? (
          <section className="resource-details">
            <h2>{selectedResource.title}</h2>
            <p>{selectedResource.description}</p>
            <a href={selectedResource.link} className="external-link" target="_blank" rel="noopener noreferrer">
              Visit {selectedResource.title}
            </a>
            <button className="back-button" onClick={handleBack}>
              Back to Resources
            </button>
          </section>
        ) : (
          <section className="job-details">
            <h2>{selectedJob.title}</h2>
            <p><strong>Company:</strong> {selectedJob.company}</p>
            <p><strong>Location:</strong> {selectedJob.location}</p>
            <p>{selectedJob.description}</p>
            <a href={selectedJob.applyLink} className="external-link" target="_blank" rel="noopener noreferrer">
              Apply for {selectedJob.title}
            </a>
            <button className="back-button" onClick={handleBack}>
              Back to Job Board
            </button>
          </section>
        )}
      </div>

      <div className="faq7-box">
        <h2>Frequently Asked Questions</h2>
        <ul>
          <li><strong>Q:</strong> Are the workshops free?<br /><strong>A:</strong> Yes, all workshops are free for registered conference attendees.</li>
          <li><strong>Q:</strong> How do I register for webinars?<br /><strong>A:</strong> You can register for webinars through the provided links.</li>
          <li><strong>Q:</strong> How often is the job board updated?<br /><strong>A:</strong> The job board is updated weekly with new opportunities.</li>
        </ul>
      </div>
    </div>
  );
};

export default CareerDevelopment;
