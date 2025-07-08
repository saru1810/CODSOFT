import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css'; // You’ll create this next

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="nav-logo">🧠 Quiz Maker</Link>
        <Link to="/" className="nav-link">🏠 Home</Link>
        <Link to="/create-quiz" className="nav-link">➕ Create Quiz</Link>
      </div>
      <div className="navbar-right">
        {location.pathname !== '/' && (
          <button className="back-button" onClick={() => navigate(-1)}>🔙 Back</button>
        )}
        <button className="logout-button" onClick={handleLogout}>🔒 Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
