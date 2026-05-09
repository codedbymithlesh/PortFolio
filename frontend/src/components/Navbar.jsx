import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { portfolio } = usePortfolio();
  const { hero } = portfolio;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Extract name for logo, fallback to "portfolio" if empty
  const displayName = hero.name ? hero.name.split(' ')[0].toLowerCase() : 'portfolio';

  return (
    <nav className="navbar">
      <div className="nav-left">
        <div className="logo-icon text-cyan" style={{background: 'transparent', display: 'flex', alignItems: 'center', fontSize: '1.5rem', width: 'auto'}}>
          {'</>'}
        </div>
        <div className="logo-text" style={{ borderLeft: 'none', paddingLeft: '0' }}>
          <span className="logo-title" style={{ fontSize: '1.4rem' }}>
            {displayName}<span className="text-cyan">.dev</span>
          </span>
        </div>
      </div>

      <div className="nav-right">
        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <a href="#home" onClick={() => setIsMenuOpen(false)}>Home</a>
          <a href="#universe" onClick={() => setIsMenuOpen(false)}>About</a>
          <a href="#tech" onClick={() => setIsMenuOpen(false)}>Skills</a>
          <a href="#builds" onClick={() => setIsMenuOpen(false)}>Projects</a>
          <a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a>
        </div>
        <div className="hamburger" onClick={toggleMenu}>
          <span className={isMenuOpen ? "line open" : "line"}></span>
          <span className={isMenuOpen ? "line open" : "line"}></span>
          <span className={isMenuOpen ? "line open" : "line"}></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
