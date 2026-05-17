import React from 'react';
import { FaCode, FaServer, FaTools } from 'react-icons/fa';
import { usePortfolio } from '../context/PortfolioContext';

const TechArsenal = React.memo(() => {
  const { portfolio } = usePortfolio();
  const { skills } = portfolio;

  return (
    <section id="tech" className="tech-section">
      <h2 className="section-title">Skills & Tech Stack</h2>

      <div className="tech-grid">
        <div className="card tech-card">
          <div className="section-header">
            <FaCode className="header-icon" style={{ color: 'var(--accent-red-light)' }} />
            <h3 className="card-title m-0">Frontend</h3>
          </div>
          <div className="pill-container mt-4">
            {(skills.frontend || []).map((s, i) => (
              <span key={i} className="skill-pill glow-violet">{s}</span>
            ))}
          </div>
        </div>

        <div className="card tech-card">
          <div className="section-header">
            <FaServer className="header-icon" style={{ color: '#06B6D4' }} />
            <h3 className="card-title m-0">Backend &amp; DB</h3>
          </div>
          <div className="pill-container mt-4">
            {(skills.backend || []).map((s, i) => (
               <span key={i} className="skill-pill glow-cyan">{s}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="card tech-card mt-4">
        <div className="section-header">
          <FaTools className="header-icon" style={{ color: 'var(--accent-gold)' }} />
          <h3 className="card-title m-0">Tools &amp; Design</h3>
        </div>
        <div className="pill-container mt-4">
          {(skills.tools || []).map((s, i) => (
            <span key={i} className="skill-pill glow-gold">{s}</span>
          ))}
        </div>
      </div>
    </section>
  );
});

export default TechArsenal;
