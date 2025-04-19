// frontend/src/components/Navbar.jsx
import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { FaUserCircle, FaSignOutAlt, FaUser } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, setUser } = useContext(UserContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <Link to="/">🌀 RetroVest</Link>
      </div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/time-machine">Time Machine</Link></li>
        <li><Link to="/time-machine-2">Time Machine 2</Link></li>
        <li><Link to="/challenge">Challenge Mode</Link></li>
        <li><Link to="/market-analysis">Market Analysis</Link></li>
        <li><Link to="/sip-calculator">SIP Calculator</Link></li>
        <li><Link to="/education">Education</Link></li>
        <li><Link to="/about">About</Link></li>

        {user ? (
          <li className="user-dropdown" ref={dropdownRef}>
            <button onClick={toggleDropdown} className="user-button">
              {user.name}
            </button>
            {dropdownOpen && (
              <ul className="dropdown-menu">
                <li>
                  <Link to="/user-profile" onClick={() => setDropdownOpen(false)}>
                    <FaUser className="dropdown-icon" /> Profile
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="dropdown-button">
                    <FaSignOutAlt className="dropdown-icon" /> Logout
                  </button>
                </li>
              </ul>
            )}
          </li>
        ) : (
          <li><Link to="/login">Login/Sign Up</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
