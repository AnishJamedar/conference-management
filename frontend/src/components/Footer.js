import React from 'react';
import './Footbar.css'
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2024 Confio. All rights reserved.</p>
        <div className="social-icons">
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <img src={require("./fblogo.png")} alt="Facebook" />
          </a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
            <img src={require("./twitterlogo.png")} alt="Twitter" />
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <img src={require("./instalogo.png")} alt="LinkedIn" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
