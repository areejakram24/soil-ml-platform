import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import soilAppClient from '../utils/api';
import { useAuth } from '../context/authContext'; 
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent) => {
  e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await soilAppClient.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      login(token, user);
      navigate('/dashboard');
    } catch (err) {
      // Avoided using 'any' by structuring standard Axios error shapes safely
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Invalid credentials');
      } else {
        setError('An unexpected login error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="login-container">
    <div className="login-card">
      <h2>Soil Analytics</h2>
      <p>Sign in to your dashboard</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email Address</label>
          <input 
            type="email" 
            placeholder="name@company.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>
        
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>
        
        <button className="submit-btn" type="submit">Sign In</button>
      </form>
      
      <p className="login-redirect-text">
        Don't have an account? <a href="/signup">Create one here</a>
      </p>
    </div>
  </div>
);
}