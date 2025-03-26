import React, { useState, useEffect } from 'react';
import confioLogo from './logo.png'; 
import { Link } from 'react-router-dom'; 
import './Home.css'

const Home = () => {
  const calculateTimeLeft = () => {
    const eventDate = new Date('January 14, 2025').getTime();
    const now = new Date().getTime();
    const difference = eventDate - now;

    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <div className="home_content">
        <header>
          <h1>Welcome to Confio</h1>
          <p>Confio is an innovative and comprehensive conference management system designed to streamline the entire process of organizing and participating in academic conferences. Built with the aim of simplifying complex workflows, Confio offers a user-friendly platform for submitting research papers, managing peer reviews, scheduling events, and facilitating virtual conferencing.</p>
        </header>

        <section>
          <h2>Key Features</h2>
          <ul>
            <li>
              <strong>Call for Papers:</strong> Submit your research papers for review. Easily upload your submission and track its status as it goes through the peer review process.
              <br /><Link to="/call-for-papers"><button className="details-button">Learn More</button></Link>
            </li>
            <li>
              <strong>Schedule & Agenda:</strong> View the full schedule of sessions, including speaker details and session times. Customize your own agenda for the conference.
              <br /><Link to="/schedule-and-agenda"><button className="details-button">View Schedule</button></Link>
            </li>
            <li>
              <strong>Virtual Conference:</strong> Join live and recorded sessions online from anywhere in the world. Participate in interactive Q&A and discussions during the sessions.
              <br /><Link to="/virtual-conference"><button className="details-button">Join Now</button></Link>
            </li>
          </ul>
        </section>
      </div>

      <div className="countdown-clock">
        <img src={confioLogo} alt="Confio Logo" className="confio-logo" />
        {timeLeft.days !== undefined ? (
          <div>
            <h2>Event Countdown</h2>
            <p>{timeLeft.days} Days, {timeLeft.hours} Hours, {timeLeft.minutes} Minutes, {timeLeft.seconds} Seconds</p>
          </div>
        ) : (
          <p>The event has started!</p>
        )}
      </div>

      <div className="news-box">
        <h2>Latest News</h2>
        <ul>
          <li>1. Call for Papers deadline extended to December 15, 2024</li>
          <li>2. AI & Machine Learning session added</li>
          <li>3. Keynote speaker announced: Dr. Jane Doe</li>
          <li>4. Early bird registration ends November 1, 2024</li>
          <li>5. Virtual networking event on January 13, 2025</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
