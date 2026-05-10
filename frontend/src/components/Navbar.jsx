import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { portfolio } = usePortfolio();
  const { hero } = portfolio;

  useEffect(() => {
    const sections = ['home', 'universe', 'tech', 'builds', 'contact'];
    
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px', // Adjust to trigger when section is in the upper part of view
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach(id => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => {
      sections.forEach(id => {
        const element = document.getElementById(id);
        if (element) observer.unobserve(element);
      });
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const displayName = hero.name ? hero.name.split(' ')[0].toLowerCase() : 'Mithlesh';

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
          <a href="#home" className={activeSection === 'home' ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>Home</a>
          <a href="#universe" className={activeSection === 'universe' ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>About</a>
          <a href="#tech" className={activeSection === 'tech' ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>Skills</a>
          <a href="#builds" className={activeSection === 'builds' ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>Projects</a>
          <a href="#contact" className={activeSection === 'contact' ? 'active' : ''} onClick={() => setIsMenuOpen(false)}>Contact</a>
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
