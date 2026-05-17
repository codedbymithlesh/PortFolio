import React from 'react';
import { FaBullseye } from 'react-icons/fa';
import { usePortfolio } from '../context/PortfolioContext';

const MyUniverse = React.memo(({ showSummaryOnly, showStrengthsOnly }) => {
  const { portfolio } = usePortfolio();
  const { about } = portfolio;

  if (showSummaryOnly) {
    return (
      <div className="card h-100 bento-about-card">
        <h2 className="section-title mb-4">About</h2>
        <div className="professional-summary">
          <h3 className="card-title text-gradient">Professional Summary</h3>
          <p className="card-text large-text">{about.professionalSummary}</p>
          <div className="divider my-4"></div>
          <div className="premium-quote">
            <span className="quote-mark">“</span>
            <p className="quote-text italic-text">{about.quote}</p>
            <span className="quote-icon-small"><FaBullseye /></span>
          </div>
        </div>
      </div>
    );
  }

  if (showStrengthsOnly) {
    return (
      <div className="card h-100 bento-about-card">
        <h3 className="card-title text-gradient">Core Strengths & Passions</h3>
        <p className="text-muted mb-3">The technical and creative pillars that drive my work.</p>
        <div className="pill-container">
          {(about.badges || []).map((b, i) => (
            <span key={i} className={`skill-pill glow-${b.type === 'orange' ? 'cyan' : (b.type === 'blue' ? 'violet' : 'gold')}`}>
              {b.label}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return null;
});

export default MyUniverse;
