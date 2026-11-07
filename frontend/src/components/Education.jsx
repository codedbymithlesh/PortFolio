import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';

const Education = React.memo(() => {
  const { portfolio } = usePortfolio();
  const { education } = portfolio;

  if (!Array.isArray(education) || education.length === 0) {
    return <p className="empty-state">Journey details have not been published yet.</p>;
  }

  return (
    <ol className="journey">
      <span className="journey__rail" aria-hidden="true">
        <span className="journey__rail-progress" />
      </span>

      {education.map((item, index) => (
        <li
          key={`${item.year}-${index}`}
          className={`journey__item journey__item--${index % 2 === 0 ? 'left' : 'right'}`}
          data-reveal={index % 2 === 0 ? 'left' : 'right'}
          style={{ '--reveal-delay': `${index * 90}ms` }}
        >
          <span className="journey__marker" aria-hidden="true" />

          <div className="journey__body">
            <span className="journey__year">{item.year}</span>
            <h3 className="journey__title">{item.title}</h3>
            {item.description && <p className="journey__desc">{item.description}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
});

export default Education;
