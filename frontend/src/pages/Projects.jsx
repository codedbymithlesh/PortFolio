import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { usePortfolio } from '../context/PortfolioContext';
import Preloader from '../components/Preloader';

const Projects = () => {
  const { portfolio, loading } = usePortfolio();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return <Preloader loading={true} />;
  }

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

  const displayedProjects = allProjects.slice(0, visibleCount);

  return (
    <div className="app-container" style={{ minHeight: '100vh', padding: '2rem 5%' }}>
      <div style={{ marginBottom: '3rem' }}>
        <Link to="/" className="view-link" style={{ fontSize: '1.1rem', display: 'inline-flex', alignItems: 'center' }}>
          <FaArrowLeft className="mr-2" style={{ marginRight: '0.5rem' }} /> Back to Home
        </Link>
      </div>
      
      <h1 className="section-title" style={{ fontSize: '3rem', marginBottom: '3rem' }}>All Projects</h1>

      <div className="builds-grid">
        {displayedProjects.map((project, i) => (
          <div key={i} className="card build-card">
            <h3 className="card-title">{project.title}</h3>
            <div className="pill-container mb-3">
              {(project.tech || []).map((t, j) => <span key={j} className="pill small">{t}</span>)}
            </div>
            <p className="card-text flex-grow">{project.description}</p>
            <div className="flex gap-2 mt-3" style={{ display: 'flex', gap: '0.8rem', marginTop: '1.25rem' }}>
              {/* Live Button */}
              {project.link && project.link !== '#' ? (
                <a href={project.link} className="btn-primary" style={{ flex: 1, textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.6rem 0.5rem', fontSize: '0.9rem' }} target="_blank" rel="noopener noreferrer">
                  Live
                </a>
              ) : (
                <button className="btn-primary" style={{ flex: 1, opacity: 0.3, cursor: 'not-allowed', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.6rem 0.5rem', fontSize: '0.9rem' }} disabled>
                  Live
                </button>
              )}

              {/* Code Button */}
              {project.codeLink && project.codeLink !== '#' ? (
                <a href={project.codeLink} className="btn-primary" style={{ flex: 1, textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.6rem 0.5rem', fontSize: '0.9rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} target="_blank" rel="noopener noreferrer">
                  Code
                </a>
              ) : (
                <button className="btn-primary" style={{ flex: 1, opacity: 0.3, cursor: 'not-allowed', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.6rem 0.5rem', fontSize: '0.9rem' }} disabled>
                  Code
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div ref={observerTarget} style={{ height: '20px', margin: '2rem 0' }}>
        {visibleCount < allProjects.length && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="adm-spinner-big" style={{ width: '30px', height: '30px' }}></div>
          </div>
        )}
      </div>
      
      {(allProjects && allProjects.length === 0) && (
        <p style={{ color: '#9CA3AF', textAlign: 'center', fontSize: '1.2rem', marginTop: '2rem' }}>
          No projects available at the moment.
        </p>
      )}
    </div>
  );
};

export default Projects;
