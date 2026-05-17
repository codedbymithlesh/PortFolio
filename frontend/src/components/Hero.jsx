import React from 'react';
import { FaCode, FaRocket, FaLaptopCode } from 'react-icons/fa';
import { usePortfolio } from '../context/PortfolioContext';

const Hero = React.memo(() => {
  const { portfolio } = usePortfolio();
  const { hero } = portfolio;

  return (
    <section id="home" className="hero-section split-layout">
      <div className="hero-content">
        <h1 className="hero-title">{hero.name}</h1>
        <h2 className="hero-subtitle typing-effect">
          <span>{hero.subtitle}</span>
        </h2>
        <p className="hero-bio">{hero.bio}</p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={() => document.getElementById('builds')?.scrollIntoView({ behavior: 'smooth' })}>
            View My Work
          </button>
        </div>
      </div>

      <div className="hero-visual">
        <div className="floating-profile-card">
          <div className="profile-glow"></div>
          <div className="profile-image-wrapper">
            <img src={hero.profileImage} alt={hero.name} loading="lazy" decoding="async" />
          </div>
          {/* Decorative floating elements */}
          <div className="floating-badge badge-1"><FaCode /></div>
          <div className="floating-badge badge-2"><FaRocket /></div>
          <div className="floating-badge badge-3"><FaLaptopCode /></div>
        </div>
      </div>
    </section>
  );
});

export default Hero;
