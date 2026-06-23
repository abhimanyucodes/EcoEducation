import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className={scrolled ? 'scrolled' : ''}>
      <Link to="/">
        <img src="/assets/logo_1.png" id="logo_img" alt="EcoEducation Logo" />
      </Link>

      <div className="info">
        {user ? (
          <>
            <Link to="/">Home</Link>
            <Link to="/quiz">Quiz</Link>
            <Link to="/leaderboard">Leaderboard</Link>
            <button onClick={handleLogout} id="logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/">HOME</Link>
            <a href="#about_us">About Us</a>
            <a href="#contact_us">Contact Us</a>
            <Link to="/signup" id="register">Register</Link>
            <Link to="/login" id="login">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;