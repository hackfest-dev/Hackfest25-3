import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import './SignupPage.css';

axios.defaults.withCredentials = true;

function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { user, setUser } = useContext(UserContext);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5001/api/auth/signup', form);
      alert('Signup successful!');
      setUser(res.data.user);
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed.');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Create an Account</h2>
        {user ? (
          <div>
            <p>You're already logged in as <strong>{user.name}</strong>.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Full Name</label>
            <input
              name="name"
              type="text"
              placeholder="Your full name"
              onChange={handleChange}
              required
            />

            <label htmlFor="email">Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              onChange={handleChange}
              required
            />

            <label htmlFor="password">Password</label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              onChange={handleChange}
              required
            />

            <button type="submit">Sign Up</button>
          </form>
        )}
        <div className="subtle-note">
          Already have an account? <a href="/login">Login</a>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
