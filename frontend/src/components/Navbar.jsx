import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Link, useLocation } from 'react-router-dom';

const Navbar = React.memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { portfolio } = usePortfolio();
  const { hero } = portfolio;
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const displayName = hero.name ? hero.name.split(' ')[0].toLowerCase() : 'Mithlesh';
  const activePath = location.pathname;

  return (
    <nav className="navbar">
      <Link 
        to="/" 
        className="nav-left" 
        style={{ cursor: 'pointer', textDecoration: 'none' }}
        onClick={() => setIsMenuOpen(false)}
      >
        <div className="logo-icon text-cyan" style={{background: 'transparent', display: 'flex', alignItems: 'center', fontSize: '1.5rem', width: 'auto'}}>
          {'</>'}
        </div>
        <div className="logo-text" style={{ borderLeft: 'none', paddingLeft: '0' }}>
          <span className="logo-title" style={{ fontSize: '1.4rem' }}>
            {displayName}<span className="text-cyan">.dev</span>
          </span>
        </div>
      </Link>

      <div className="nav-right">
        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <Link 
            to="/" 
            className={activePath === '/' ? 'active' : ''} 
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className={activePath === '/about' ? 'active' : ''} 
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          <Link 
            to="/skills" 
            className={activePath === '/skills' ? 'active' : ''} 
            onClick={() => setIsMenuOpen(false)}
          >
            Skills
          </Link>
          <Link 
            to="/projects" 
            className={activePath === '/projects' ? 'active' : ''} 
            onClick={() => setIsMenuOpen(false)}
          >
            Projects
          </Link>
          <Link 
            to="/contact" 
            className={activePath === '/contact' ? 'active' : ''} 
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
        </div>
        <div className="hamburger" onClick={toggleMenu}>
          <span className={isMenuOpen ? "line open" : "line"}></span>
          <span className={isMenuOpen ? "line open" : "line"}></span>
          <span className={isMenuOpen ? "line open" : "line"}></span>
        </div>
      </div>
    </nav>
  );
});

export default Navbar;
