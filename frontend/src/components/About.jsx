import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';

const About = React.memo(() => {
  const { portfolio } = usePortfolio();
  const { about } = portfolio;
  const badges = Array.isArray(about.badges) ? about.badges : [];

  const hasSummary = Boolean(about.professionalSummary);
  const hasQuote = Boolean(about.quote);

  if (!hasSummary && !hasQuote && badges.length === 0) {
    return <p className="empty-state">Profile details have not been published yet.</p>;
  }

  return (
    <div className="about">
      {hasSummary && (
        <div
          className="about__statement"
          data-reveal
          style={{ '--reveal-delay': '40ms' }}
        >
          <p className="about__summary">{about.professionalSummary}</p>
        </div>
      )}

      {hasQuote && (
        <div
          className="about__quote"
          data-reveal="fade"
          style={{ '--reveal-delay': '200ms' }}
        >
          <span className="about__quote-mark" aria-hidden="true">“</span>
          <blockquote className="about__quote-text">{about.quote}</blockquote>
        </div>
      )}

      <div
        className="about__strengths"
        data-reveal
        style={{ '--reveal-delay': '320ms' }}
      >
        <h3 className="about__label">Core strengths</h3>
        {badges.length > 0 ? (
          <ul className="about__tags">
            {badges.map((badge, index) => (
              <li key={`${badge.label}-${index}`} className="about__tag">
                {badge.label}
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-state empty-state--small">Strengths have not been published yet.</p>
        )}
      </div>
    </div>
  );
});

export default About;
