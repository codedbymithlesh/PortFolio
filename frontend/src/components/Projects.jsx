import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { usePortfolio } from '../context/PortfolioContext';

const FeaturedBuilds = () => {
  const { portfolio } = usePortfolio();
  const { projects } = portfolio;
  
  const displayedProjects = (projects || []).slice(0, 6);
  const hasMore = (projects || []).length > 6;

  return (
    <section id="builds" className="builds-section mt-5">
      <h2 className="section-title">Projects</h2>

      <div className="builds-grid">
        {displayedProjects.map((project, i) => (
          <div key={i} className="card build-card">
            <h3 className="card-title">{project.title}</h3>
            <div className="pill-container mb-3">
              {(project.tech || []).map((t, j) => <span key={j} className="pill small">{t}</span>)}
            </div>
            <p className="card-text flex-grow">{project.description}</p>
            <a href={project.link || '#'} className="view-link mt-3" target="_blank" rel="noopener noreferrer">
              {project.linkLabel || 'View'} <FaArrowRight className="ml-2" />
            </a>
          </div>
        ))}
      </div>
      
      {hasMore && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
          <Link to="/projects" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            View All Projects <FaArrowRight />
          </Link>
        </div>
      )}
    </section>
  );
};

export default FeaturedBuilds;
