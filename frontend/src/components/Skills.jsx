import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';

const CATEGORY_META = {
  frontend: { label: 'Frontend', titleId: 'capability-frontend' },
  backend: { label: 'Backend', titleId: 'capability-backend' },
  tools: { label: 'Tools & systems', titleId: 'capability-tools' },
};

const Skills = React.memo(() => {
  const { portfolio } = usePortfolio();
  const { skills } = portfolio;

  const categories = Object.keys(CATEGORY_META)
    .filter((category) => Array.isArray(skills[category]) && skills[category].length > 0);

  if (categories.length === 0) {
    return <p className="empty-state">Capabilities have not been published yet.</p>;
  }

  return (
    <div className="stack">
      <span className="stack__ghost" aria-hidden="true">Stack</span>

      <ul className="stack__list">
        {categories.map((category, index) => {
          const meta = CATEGORY_META[category];
          const items = skills[category];

          return (
            <li
              key={category}
              className="stack-row"
              data-reveal
              style={{ '--reveal-delay': `${index * 110}ms` }}
            >
              <div className="stack-row__head">
                <span className="stack-row__index" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 id={meta.titleId} className="stack-row__title">
                  {meta.label}
                </h3>
              </div>

              <ul className="stack-row__items" aria-labelledby={meta.titleId}>
                {items.map((item, itemIndex) => (
                  <li key={`${item}-${itemIndex}`} className="stack-row__item">
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
});

export default Skills;
