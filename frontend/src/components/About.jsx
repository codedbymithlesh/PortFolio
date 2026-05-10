import React from 'react';
import { FaBolt, FaPuzzlePiece, FaYoutube, FaGamepad, FaBullseye } from 'react-icons/fa';
import { usePortfolio } from '../context/PortfolioContext';

const ICON_MAP = {
  '⚡': <FaBolt />,
  '🧩': <FaPuzzlePiece />,
  '▶️': <FaYoutube />,
  '🎮': <FaGamepad />,
};

const MyUniverse = () => {
  const { portfolio } = usePortfolio();
  const { about } = portfolio;

  return (
    <div className="universe-section" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h2 className="section-title">About</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flexGrow: 1 }}>
        <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 className="card-title">Professional Summary</h3>
          <p className="card-text">{about.professionalSummary}</p>
          <div className="divider"></div>
          <div className="icon-quote">
            <span className="quote-icon"><FaBullseye /></span>
            <p className="quote-text">{about.quote}</p>
          </div>
        </div>

        <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 className="card-title">Core Strengths &amp; Passions</h3>
          <div className="badges-grid">
            {(about.badges || []).map((b, i) => (
              <span key={i} className={`badge badge-${b.type || 'orange'}`}>{b.label}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyUniverse;
