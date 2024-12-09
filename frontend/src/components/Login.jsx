import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from './api'; // imports the centralized API

const Login = ({ setIsAuthenticated }) => {
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
      const response = await api.post('/login', { username, password });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setIsAuthenticated(true); // Set authentication status
        navigate('/Account');
      } else {
        alert('Invalid credentials, please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.error || 'An error occurred during login.'); // Set error message from backend
    }
  };

  return (
    <>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/NationalDex">NationalDex</Link></li>
          <li><Link to="/Register">Register</Link></li>
          <li><Link to="/Account">Account</Link></li>
        </ul>
      </nav>
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Conditionally render error message */}
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
        <button type="submit">Login</button>
      </form>
    </>
  );
};

export default Login;
