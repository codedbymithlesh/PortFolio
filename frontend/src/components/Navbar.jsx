import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { useTheme } from '../context/ThemeContext';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUser, FaCode, FaBriefcase, FaEnvelope, FaSun, FaMoon } from 'react-icons/fa';

const BASE_NAV = [
  { path: '/', label: 'Home', icon: <FaHome /> },
  { path: '/about', label: 'About', icon: <FaUser /> },
  { path: '/skills', label: 'Skills', icon: <FaCode /> },
  { path: '/projects', label: 'Projects', icon: <FaBriefcase /> },
  { path: '/contact', label: 'Contact', icon: <FaEnvelope /> },
];

const Navbar = React.memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { portfolio } = usePortfolio();
  const { theme, toggleTheme } = useTheme();
  const { hero } = portfolio;
  const location = useLocation();
  const activePath = location.pathname;

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="nav-left" style={{ textDecoration: 'none' }} onClick={() => setIsMenuOpen(false)}>
          <div className="logo-icon">&lt;/&gt;</div>
          <div className="logo-text">
            <span className="logo-title">CodedByMithlesh<span style={{color:'var(--accent-green)'}}>.dev</span></span>
          </div>
        </Link>

        <div className="nav-right">
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? <FaSun /> : <FaMoon />}
          </button>
          <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            <Link to="/" className={activePath === '/' ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>home.jsx</Link>
            <Link to="/about" className={activePath === '/about' ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>about.md</Link>
            <Link to="/skills" className={activePath === '/skills' ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>skills.json</Link>
            <Link to="/projects" className={activePath === '/projects' ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>projects/</Link>
            <Link to="/contact" className={activePath === '/contact' ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>contact.sh</Link>
          </div>
          <div className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span className={isMenuOpen ? "line open" : "line"}></span>
            <span className={isMenuOpen ? "line open" : "line"}></span>
            <span className={isMenuOpen ? "line open" : "line"}></span>
          </div>
        </div>
      </nav>

      <nav className="portfolio-bottom-nav">
        {BASE_NAV.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`portfolio-bottom-item ${activePath === item.path ? 'active' : ''}`}
          >
            <span className="portfolio-bottom-icon">{item.icon}</span>
            <span className="portfolio-bottom-label">{item.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
});

export default Navbar;
