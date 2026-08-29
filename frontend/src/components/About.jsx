import React from 'react';
import { FaFileCode } from 'react-icons/fa';
import { usePortfolio } from '../context/PortfolioContext';
import WaveLayers from './WaveLayers';

const MyUniverse = React.memo(({ showSummaryOnly, showStrengthsOnly }) => {
  const { portfolio } = usePortfolio();
  const { about } = portfolio;

  if (showSummaryOnly) {
    return (
      <div className="about-readme liquid-wave">
        <WaveLayers />
        <div className="readme-header">
          <span className="icon"><FaFileCode /></span>
          <span>about/README.md</span>
        </div>
        <div className="readme-body">
          <h2>About Me</h2>
          <p>{about.professionalSummary}</p>
          <div className="readme-quote">
            {about.quote}
          </div>
        </div>
      </div>
    );
  }

  if (showStrengthsOnly) {
    return (
      <div className="about-readme liquid-wave">
        <WaveLayers />
        <div className="readme-header">
          <span className="icon"><FaFileCode /></span>
          <span>skills.config.js</span>
        </div>
        <div className="readme-body">
          <h2>Core Strengths</h2>
          <p style={{fontSize:'0.82rem', color:'var(--text-dim)', marginBottom:'0.4rem', fontFamily:'var(--font-mono)'}}>
            <span className="cm">{'// what drives my work'}</span>
          </p>
          <div className="pill-container">
            {(about.badges || []).map((b, i) => {
              const colorMap = { orange: 'orange', blue: 'purple', red: 'purple' };
              return (
                <span key={i} className={`skill-pill ${colorMap[b.type] || ''}`}>
                  {b.label}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return null;
});

export default MyUniverse;
