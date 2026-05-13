import React from 'react';
import { FaGraduationCap } from 'react-icons/fa';
import { usePortfolio } from '../context/PortfolioContext';

const Education = React.memo(() => {
  const { portfolio } = usePortfolio();
  const { education } = portfolio;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h2 className="section-title" style={{ visibility: 'hidden' }}>Spacer</h2>
      <div className="education-section card scrollable-card" style={{ flexGrow: 1 }}>
        <div className="section-header">
          <FaGraduationCap className="header-icon text-cyan" />
          <h2 className="card-title m-0">Education &amp; Certs</h2>
        </div>

        <div className="timeline">
          {(education || []).map((item, i) => (
            <div key={i} className="timeline-item">
              <div className={`timeline-dot ${item.dotColor || 'blue'}`}></div>
              <span className={`timeline-date ${item.dotColor || 'blue'}-text`}>{item.year}</span>
              <h4 className="timeline-title">{item.title}</h4>
              <p className="timeline-desc">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default Education;
