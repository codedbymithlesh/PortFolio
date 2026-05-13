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

  const { projects } = portfolio;

  return (
    <div className="app-container" style={{ minHeight: '100vh', padding: '2rem 5%' }}>
      <div style={{ marginBottom: '3rem' }}>
        <Link to="/" className="view-link" style={{ fontSize: '1.1rem', display: 'inline-flex', alignItems: 'center' }}>
          <FaArrowLeft className="mr-2" style={{ marginRight: '0.5rem' }} /> Back to Home
        </Link>
      </div>
      
      <h1 className="section-title" style={{ fontSize: '3rem', marginBottom: '3rem' }}>All Projects</h1>

      <div className="builds-grid">
        {(projects || []).map((project, i) => (
          <div key={i} className="card build-card">
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
      
      {(projects && projects.length === 0) && (
        <p style={{ color: '#9CA3AF', textAlign: 'center', fontSize: '1.2rem', marginTop: '2rem' }}>
          No projects available at the moment.
        </p>
      )}
    </div>
  );
};

export default Projects;
