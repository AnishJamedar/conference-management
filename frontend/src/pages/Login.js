import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsLoggedIn, setRole }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userId', data.id);
        console.log("userId set in localStorage:", localStorage.getItem('userId'));
        localStorage.setItem('role', data.role); 
        setIsLoggedIn(true);
        setRole(data.role); 
        if (data.role === 'admin') {
          navigate('/admin-dashboard'); // Redirect to Admin Dashboard
        } else {
          navigate('/home'); 
        }
      } else {
        setError(data.message || 'Invalid login credentials');
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
