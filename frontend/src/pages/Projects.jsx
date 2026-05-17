import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaExternalLinkAlt, FaCode } from 'react-icons/fa';
import { usePortfolio } from '../context/PortfolioContext';
import Preloader from '../components/Preloader';

const Projects = () => {
  const { portfolio, loading } = usePortfolio();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const allProjects = React.useMemo(() => [...(portfolio.projects || [])].reverse(), [portfolio.projects]);
  const [visibleCount, setVisibleCount] = React.useState(6);
  const observerTarget = React.useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < allProjects.length) {
          setVisibleCount((prev) => prev + 3);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [visibleCount, allProjects.length]);

  if (loading) {
    return <Preloader loading={true} />;
  }

  const displayedProjects = allProjects.slice(0, visibleCount);

  return (
    <div className="archive-page-wrapper">
      <div className="archive-header reveal">
        <div className="archive-breadcrumbs">
          <Link to="/">Home</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Projects Archive</span>
        </div>
        <h1 className="archive-main-title">All Projects</h1>
        <p className="archive-subtitle">A comprehensive archive of production applications, tools, and technical experiments I have engineered.</p>
      </div>

      <div className="archive-grid">
        {displayedProjects.map((project, i) => (
          <div key={i} className="archive-card reveal">
            <div className="archive-image-wrapper">
              {project.previewImage ? (
                <img src={project.previewImage} alt={project.title} className="archive-image" />
              ) : (
                <div className="no-preview showcase-no-preview">
                  <span className="no-preview-text">Masterpiece in Progress</span>
                </div>
              )}
              <div className="archive-overlay"></div>
            </div>
            
            <div className="archive-content">
              <h3 className="archive-title">{project.title}</h3>
              <div className="showcase-tags mb-3">
                {(project.tech || []).slice(0, 3).map((t, j) => (
                  <span key={j} className="showcase-tag">{t}</span>
                ))}
              </div>
              <p className="archive-desc">{project.description}</p>
              
              <div className="archive-actions">
                {project.link && project.link !== '#' ? (
                  <a href={project.link} className="showcase-btn primary" target="_blank" rel="noopener noreferrer">
                    <FaExternalLinkAlt /> Live
                  </a>
                ) : (
                  <span className="showcase-btn disabled">Private</span>
                )}

                {project.codeLink && project.codeLink !== '#' ? (
                  <a href={project.codeLink} className="showcase-btn secondary" target="_blank" rel="noopener noreferrer">
                    <FaCode /> Code
                  </a>
                ) : (
                  <span className="showcase-btn disabled">Private</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div ref={observerTarget} style={{ height: '50px', margin: '4rem 0', display: 'flex', justifyContent: 'center' }}>
        {visibleCount < allProjects.length && (
          <div className="adm-spinner-big" style={{ width: '40px', height: '40px', borderTopColor: 'var(--accent-red)' }}></div>
        )}
      </div>
      
      {(allProjects && allProjects.length === 0) && (
        <p style={{ color: '#9CA3AF', textAlign: 'center', fontSize: '1.2rem', marginTop: '2rem' }}>
          The archive is currently empty. Check back soon!
        </p>
      )}
    </div>
  );
};

export default Projects;
