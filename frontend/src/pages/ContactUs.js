import React, { useState, useEffect } from 'react';
import './ContactUs.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: '',
  });

  const [responseMessage, setResponseMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.error('User ID not found in local storage');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5001/auth/${userId}`);
        if (response.ok) {
          const user = await response.json();
          setUserDetails(user);
          setFormData((prevData) => ({
            ...prevData,
            name: user.username,
            email: user.email,
          }));
        } else {
          console.error('Failed to fetch user details');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userDetails) {
      setResponseMessage('User details could not be retrieved. Please try again later.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId: userDetails.id,
          username: userDetails.username,
        }),
      });

      if (response.ok) {
        setResponseMessage('Thank you! Your message has been received, and we’ve emailed you a confirmation.');
        setFormData((prevData) => ({
          ...prevData,
          subject: 'general',
          message: '',
        }));
      } else {
        setResponseMessage('Sorry, something went wrong. Please try again later.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setResponseMessage('An error occurred. Please try again.');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="main-content">
      <header>
        <h1>Contact Us</h1>
        <p>Have questions or need assistance? Reach out to us below.</p>
      </header>

      <section>
        <h2>Contact Form</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              readOnly
            />
          </label>

          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              readOnly
            />
          </label>

          <label>
            Subject:
            <select name="subject" value={formData.subject} onChange={handleChange} required>
              <option value="general">General Inquiry</option>
              <option value="support">Technical Support</option>
              <option value="feedback">Feedback</option>
            </select>
          </label>

          <label>
            Message:
            <textarea
              rows="4"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </label>

          <button type="submit">Submit</button>
        </form>
        {responseMessage && <p className="response-message">{responseMessage}</p>}
      </section>

      <section>
        <h2>Contact Information</h2>
        <p>If you prefer, you can contact us directly via email or phone:</p>
        <ul>
          <li><strong>Email:</strong> support@yourdomain.com</li>
          <li><strong>Phone:</strong> +1 (123) 456-7890</li>
        </ul>
      </section>

      <section>
        <h2>Our Location</h2>
        <iframe
          title="Our Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019215065075!2d-122.41941518468236!3d37.77492927975986!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858064b2b7a4f7%3A0x5b5a4a30eb45a0bd!2sSan+Francisco%2C+CA%2C+USA!5e0!3m2!1sen!2s!4v1631556811432!5m2!1sen!2s"
          width="100%"
          height="450"
          allowFullScreen=""
          loading="lazy"
          style={{ border: 0 }}
        ></iframe>
      </section>
    </div>
  );
};

       
export default ContactUs;
