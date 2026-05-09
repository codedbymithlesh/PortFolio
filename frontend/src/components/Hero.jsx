import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';

const Hero = () => {
  const { portfolio } = usePortfolio();
  const { hero } = portfolio;

  return (
    <section id="home" className="hero-section">
      <div className="profile-container">
        <div className="profile-glow"></div>
        <div className="profile-image">
          <img src={hero.profileImage} alt={hero.name} />
        </div>
      </div>

      <h1 className="hero-title">{hero.name}</h1>
      <h2 className="hero-subtitle">{hero.subtitle}</h2>

      <p className="hero-bio">{hero.bio}</p>

      <button className="btn-primary" onClick={() => document.getElementById('builds')?.scrollIntoView({ behavior: 'smooth' })}>
        View My Work
      </button>
    </section>
  );
};

export default Hero;
