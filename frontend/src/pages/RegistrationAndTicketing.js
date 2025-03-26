import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegistrationAndTicketing.css';

const RegistrationAndTicketing = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    ticketType: 'general',
  });
  const [error, setError] = useState('');
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5001/api/registrations/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      const registrationId = data.registration.id;

      // Pass registrationId and ticketType to the payment form page
      navigate('/paymentform', {
        state: { registrationId, ticketType: formData.ticketType },
      });
    } catch (err) {
      console.error('Registration error:', err);
      setError('Registration failed. Please try again.');
    }
  };


  useEffect(() => {
    // Simulate checking payment status on page load
    setPaymentCompleted(false); // Reset payment status when component mounts
  }, []);

  return (
    <div>
      {paymentCompleted ? (
        <div className="main-content">
          <header>
            <h1>Welcome to Confio 2024</h1>
          </header>
          <p>You have successfully registered and completed payment. Please log in to continue.</p>
        </div>
      ) : (
        <div className="main-content">
          <header>
            <h1>Conference Registration & Ticketing</h1>
            <p>Register now and secure your spot for Confio 2024!</p>
          </header>

          <form onSubmit={handleRegister}>
            <label>
              Full Name:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </label>

            <label>
              Email:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </label>

            <label>
              Ticket Type:
              <select
                name="ticketType"
                value={formData.ticketType}
                onChange={handleInputChange}
                required
              >
                <option value="general">General Admission - $99</option>
                <option value="vip">VIP Access - $199</option>
                <option value="student">Student Admission - $49</option>
              </select>
            </label>

            <button type="submit" className="register-button">
              Register
            </button>
            {error && <p className="error-message">{error}</p>}
          </form>
        </div>
      )}
    </div>
  );
};

export default RegistrationAndTicketing;