import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = ({ setIsLoggedIn }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user', // Default role to 'user'
    expertise: '', // Selected conference ID
  });
  const [conferences, setConferences] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch conference options
  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/conferences');
        if (!response.ok) throw new Error('Failed to fetch conferences');
        const data = await response.json();
        setConferences(data);
      } catch (err) {
        console.error('Error fetching conferences:', err);
        setError('Failed to load conference options.');
      }
    };

    fetchConferences();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Password validation regex: Minimum 6 characters, at least 1 number, 1 special character, and 1 letter
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password and confirm password match check
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Password validation
    if (!validatePassword(formData.password)) {
      setError('Password must be at least 6 characters long, contain at least one letter, one number, and one special character.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Response data:', data); // Log the response data for debugging

      if (response.ok) {
        // Registration was successful
        console.log('Registration successful');
        setError(''); // Clear any previous error
        setIsLoggedIn(true);
        navigate('/registration-and-ticketing');
      } else {
        // Registration failed; display server-provided message or generic error
        console.log('Registration error:', data.error || 'Unknown error');
        setError(data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="register-page">
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <label>Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        
        <label>Role</label>
        <select name="role" value={formData.role} onChange={handleChange} required>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="speaker">Speaker</option>
        </select>

        <label>Area of Expertise (Conference)</label>
        <select
          name="expertise"
          value={formData.expertise}
          onChange={handleChange}
          required
        >
          <option value="">-- Select a Conference --</option>
          {conferences.map((conference) => (
            <option key={conference.id} value={conference.id}>
              {conference.name}
            </option>
          ))}
        </select>

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
