import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { usePortfolio } from '../context/PortfolioContext';

const FeaturedBuilds = React.memo(() => {
  const { portfolio } = usePortfolio();
  const { projects } = portfolio;
  const [visibleCount, setVisibleCount] = React.useState(6);
  
  const allProjects = projects || [];
  const displayedProjects = React.useMemo(() => allProjects.slice(0, visibleCount), [allProjects, visibleCount]);
  const hasMore = allProjects.length > visibleCount;

  const handleLoadMore = React.useCallback(() => {
    setVisibleCount(allProjects.length);
  }, [allProjects.length]);

  return (
    <section id="builds" className="builds-section mt-5">
      <h2 className="section-title">Projects</h2>

      <div className="builds-grid">
        {displayedProjects.map((project, i) => (
          <div key={i} className="card build-card reveal">
            <h3 className="card-title">{project.title}</h3>
            <div className="pill-container mb-3">
              {(project.tech || []).map((t, j) => <span key={j} className="pill small">{t}</span>)}
            </div>
            <p className="card-text flex-grow">{project.description}</p>
            <a href={project.link || '#'} className="btn-primary mt-3" style={{ textAlign: 'center', textDecoration: 'none', display: 'inline-block', width: 'fit-content', padding: '0.6rem 1.8rem' }} target="_blank" rel="noopener noreferrer">
              Live
            </a>
          </div>
        ))}
      </div>
      
      {hasMore && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
          <Link 
            to="/all-projects" 
            className="btn-primary reveal" 
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
          >
            View All Projects <FaArrowRight />
          </Link>
        </div>
      )}
    </section>
  );
});

export default FeaturedBuilds;
