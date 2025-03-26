import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from './logo.png'; 
import './Navbar.css';

const Navbar = ({ isLoggedIn, setIsLoggedIn, role, setRole }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('role'); 
    setIsLoggedIn(false);
    setRole(null);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img 
          src={logo} 
          alt="Confio Logo" 
          className="logo"
          style={{ width: '50px', height: 'auto', marginRight: '10px' }} 
        />
      </div>
      <ul className="nav-links">
  {isLoggedIn && role === 'admin' ? (
    <li><button className="logout-button" onClick={handleLogout}>Logout</button></li>
  ) : (
    <>
      {isLoggedIn && (
        <>
          <li><NavLink exact to="/home" className="nav-link">Home</NavLink></li>
          <li><NavLink to="/call-for-papers" className="nav-link">Call for Papers</NavLink></li>
          <li><NavLink to="/submissions" className="nav-link">Submissions</NavLink></li>
          <li><NavLink to="/peer-review" className="nav-link">Peer Review</NavLink></li>
          <li><NavLink to="/schedule-and-agenda" className="nav-link">Schedule & Agenda</NavLink></li>
          <li><NavLink to="/registration-and-ticketing" className="nav-link">Registration & Ticketing</NavLink></li>
          <li><NavLink to="/virtual-conference" className="nav-link">Virtual Conference</NavLink></li>
          <li><NavLink to="/career-development" className="nav-link">Career Development</NavLink></li>
          <li><NavLink to="/mentorship" className="nav-link">Mentorship</NavLink></li>
          <li><NavLink to="/chat" className="nav-link">Chat</NavLink></li>
          <li><NavLink to="/contact-us" className="nav-link">Contact Us</NavLink></li>
        </>
      )}
      {isLoggedIn ? (
        <li><button className="logout-button" onClick={handleLogout}>Logout</button></li>
      ) : (
        <>
          <li><NavLink to="/login" className="nav-link">Login</NavLink></li>
          <li><NavLink to="/register" className="nav-link">Register</NavLink></li>
        </>
      )}
    </>
  )}
</ul>
    </nav>
  );
};

export default Navbar;