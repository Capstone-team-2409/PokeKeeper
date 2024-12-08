import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from './api'; // imports the centralized API

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State for error messages
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username || !password) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await api.post('/register', { username, password });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        alert('Registration successful, please log in.');
        navigate('/profile');
      } else {
       
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.error || 'An error occurred during registration.'); // Set error message from backend
    }
  };

  return (
    <>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/NationalDex">NationalDex</Link></li>
          <li><Link to="/register">Register</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/profile">Profile</Link></li>
        </ul>
      </nav>
      <form onSubmit={handleSubmit}>
        <h2>Register</h2>
        {error && <p style={{ color: `darkred` }}>{error}</p>} {/* Conditionally render error message */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
    </>
  );
};

export default Register;
