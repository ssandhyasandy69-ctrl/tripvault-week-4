import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          🗺️ TripVault
        </Link>

        <button
          className="navbar-toggle"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span className={`hamburger ${menuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {user ? (
            <>
              <Link to="/dashboard" onClick={closeMenu}>
                Dashboard
              </Link>
              <button className="btn-secondary navbar-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu}>
                Login
              </Link>
              <Link to="/register" onClick={closeMenu}>
                <button className="navbar-cta">Register</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
