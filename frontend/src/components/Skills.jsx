import React from 'react';
import { FaCode, FaServer, FaTools } from 'react-icons/fa';
import { usePortfolio } from '../context/PortfolioContext';

const TechArsenal = () => {
  const { portfolio } = usePortfolio();
  const { skills } = portfolio;

  return (
    <section id="tech" className="tech-section">
      <h2 className="section-title">Skills</h2>

      <div className="tech-grid">
        <div className="card tech-card">
          <div className="section-header">
            <FaCode className="header-icon text-cyan" />
            <h3 className="card-title m-0">Frontend</h3>
          </div>
          <div className="pill-container">
            {(skills.frontend || []).map((s, i) => <span key={i} className="pill">{s}</span>)}
          </div>
        </div>

        <div className="card tech-card">
          <div className="section-header">
            <FaServer className="header-icon text-cyan" />
            <h3 className="card-title m-0">Backend &amp; DB</h3>
          </div>
          <div className="pill-container">
            {(skills.backend || []).map((s, i) => <span key={i} className="pill">{s}</span>)}
          </div>
        </div>
      </div>

      <div className="card tech-card mt-4">
        <div className="section-header">
          <FaTools className="header-icon text-cyan" />
          <h3 className="card-title m-0">Tools &amp; Design</h3>
        </div>
        <div className="pill-container">
          {(skills.tools || []).map((s, i) => <span key={i} className="pill">{s}</span>)}
        </div>
      </div>
    </section>
  );
};

export default TechArsenal;
