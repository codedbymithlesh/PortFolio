import React from 'react';
import { FaLaptopCode, FaServer, FaTools } from 'react-icons/fa';
import { usePortfolio } from '../context/PortfolioContext';
import WaveLayers from './WaveLayers';

const categoryMeta = {
  frontend: { icon: FaLaptopCode, color: 'var(--accent-green)', label: 'Frontend' },
  backend:  { icon: FaServer,      color: 'var(--accent-blue)',  label: 'Backend' },
  tools:    { icon: FaTools,       color: 'var(--accent-orange)', label: 'Tools & Technologies' },
};

const techColors = {
  'react.js':     '#61dafb',
  'javascript':   '#f7df1e',
  'html':         '#e34f26',
  'css':          '#1572b6',
  'tailwind css': '#06b6d4',
  'node.js':      '#339933',
  'express.js':   '#ffffff',
  'mongodb':      '#47a248',
  'mysql':        '#4479a1',
  'php':          '#777bb4',
  'python':       '#3776ab',
  'rest apis':    '#4CC1AA',
  'git':          '#f05032',
  'github':       '#ffffff',
  'vs code':      '#007acc',
  'postman':      '#ff6c37',
  'figma':        '#f24e1e',
  'npm':          '#cb3837',
  'linux':        '#fcc624',
  'vite':         '#646cff',
  'next.js':      '#ffffff',
};

const SkillCard = React.memo(({ category, skills, index }) => {
  const meta = categoryMeta[category];
  if (!meta) return null;
  const Icon = meta.icon;

  return (
    <div className={`skill-category-card liquid-wave reveal reveal-delay-${(index % 3) + 1}`}>
      <WaveLayers />
      <div className="skill-category-header">
        <span className="skill-category-icon" style={{ color: meta.color }}>
          <Icon />
        </span>
        <h3 className="skill-category-title" style={{ color: meta.color }}>
          {meta.label}
        </h3>
      </div>
      <div className="skill-chips">
        {skills.map((s, i) => {
          const dotColor = techColors[s.toLowerCase()] || 'var(--accent-green)';
          return (
            <span key={i} className="skill-chip">
              <span className="skill-chip-dot" style={{ background: dotColor }}></span>
              {s}
            </span>
          );
        })}
      </div>
    </div>
  );
});

const TechArsenal = React.memo(() => {
  const { portfolio } = usePortfolio();
  const { skills } = portfolio;

  const categories = ['frontend', 'backend', 'tools'].filter(c => skills[c]?.length);

  const enriched = categories.map(c => ({
    ...categoryMeta[c],
    category: c,
    skills: skills[c],
  }));

  return (
    <section id="tech" className="tech-section">
      <div className="section-label">tech.stack</div>
      <h2 className="section-title">Skills & Tools</h2>
      <p className="section-subtitle">Technologies I work with daily</p>

      <div className="skill-categories-grid">
        {enriched.map((cat, i) => (
          <SkillCard key={cat.category} category={cat.category} skills={cat.skills} index={i} />
        ))}
      </div>
    </section>
  );
});

export default TechArsenal;
