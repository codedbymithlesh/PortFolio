import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';

const Hero = React.memo(() => {
  const { portfolio } = usePortfolio();
  const { hero } = portfolio;

  return (
    <section id="home" className="hero-section">
      <div className="hero-content">
        <div className="section-label">developer.profile</div>
        <h1 className="hero-title">{hero.name}</h1>
        <p className="hero-role">
          {'// '}<span className="hl">{hero.subtitle}</span>
        </p>
        <p className="hero-bio">{hero.bio}</p>
        <div className="hero-actions">
          <button className="btn-primary" data-cursor="action" onClick={() => document.getElementById('builds')?.scrollIntoView({ behavior: 'smooth' })}>
            View Projects
          </button>
        </div>
      </div>

      <div className="hero-visual">
        <div className="profile-card">
          <div className="profile-avatar">
            <img src={hero.profileImage} alt={hero.name} loading="lazy" decoding="async" />
          </div>
          <div className="profile-name">{hero.name}</div>
          <div className="profile-role">{hero.subtitle}</div>
        </div>
      </div>
    </section>
  );
});

export default Hero;
