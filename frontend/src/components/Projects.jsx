import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaExternalLinkAlt, FaCode, FaGithub } from 'react-icons/fa';
import { usePortfolio } from '../context/PortfolioContext';
import WaveLayers from './WaveLayers';

const getLangDot = (tech) => {
  const t = (tech || '').toLowerCase();
  if (t.includes('react') || t.includes('jsx')) return 'react';
  if (t.includes('javascript') || t.includes('js')) return 'js';
  if (t.includes('html')) return 'html';
  if (t.includes('css') || t.includes('tailwind')) return 'css';
  if (t.includes('node')) return 'node';
  if (t.includes('mongo')) return 'mongo';
  return 'default';
};

const FeaturedBuilds = React.memo(() => {
  const { portfolio } = usePortfolio();
  const { projects } = portfolio;
  const displayedProjects = React.useMemo(() => [...(projects || [])].reverse().slice(0, 5), [projects]);

  return (
    <section id="builds" className="showcase-section">
      <div className="section-header-centered reveal">
        <div className="section-label" style={{justifyContent:'center'}}>
          featured.repos
        </div>
        <h2 className="section-title" style={{fontSize:'1.6rem'}}>Projects</h2>
        <p className="section-subtitle">Things I've built recently</p>
      </div>

      <div className="repo-grid">
        {displayedProjects.map((project, i) => (
          <div key={i} className={`repo-card liquid-wave reveal reveal-delay-${(i % 3) + 1}`}>
            <WaveLayers />
            <div className="repo-card-header">
              <span className="repo-icon"><FaGithub /></span>
              <span className="repo-name">{project.title}</span>
            </div>
            <p className="repo-desc">{project.description}</p>
            <div className="repo-tags">
              {(project.tech || []).map((t, j) => (
                <span key={j} className="repo-tag">
                  <span className={`dot ${getLangDot(t)}`}></span>
                  {t}
                </span>
              ))}
            </div>
            <div className="repo-actions">
              {project.link && project.link !== '#' ? (
                <a href={project.link} className="repo-btn live" target="_blank" rel="noopener noreferrer" data-cursor="open">
                  <FaExternalLinkAlt /> Live
                </a>
              ) : (
                <span className="repo-btn disabled">Private</span>
              )}
              {project.codeLink && project.codeLink !== '#' ? (
                <a href={project.codeLink} className="repo-btn code" target="_blank" rel="noopener noreferrer" data-cursor="open">
                  <FaCode /> Code
                </a>
              ) : (
                <span className="repo-btn disabled">Private</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {projects?.length > 5 && (
        <div className="showcase-footer reveal">
          <Link to="/all-projects" className="all-repos-btn" data-cursor="nav">
            View All Repositories <FaArrowRight className="ml-2" />
          </Link>
        </div>
      )}
    </section>
  );
});

export default FeaturedBuilds;
