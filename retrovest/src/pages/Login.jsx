import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import './Login.css';

axios.defaults.withCredentials = true;

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { user, setUser } = useContext(UserContext);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5001/api/auth/login', form);
      alert('Login successful!');
      setUser(res.data.user);
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome Back</h2>
        {user ? (
          <div>
            <p>You're already logged in as <strong>{user.name}</strong>.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email Address</label>
            <input name="email" type="email" placeholder="you@example.com" onChange={handleChange} required />

            <label htmlFor="password">Password</label>
            <input name="password" type="password" placeholder="Enter your password" onChange={handleChange} required />

            <button type="submit">Login</button>
          </form>
        )}
        <div className="subtle-note">
          Don’t have an account? <a href="/SignupPage">Sign Up</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
