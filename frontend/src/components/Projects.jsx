import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { usePortfolio } from '../context/PortfolioContext';

const FeaturedBuilds = React.memo(() => {
  const { portfolio } = usePortfolio();
  const { projects } = portfolio;
  const displayedProjects = React.useMemo(() => [...(projects || [])].reverse().slice(0, 6), [projects]);

  return (
    <section id="builds" className="builds-section mt-5">
      <h2 className="section-title">Projects</h2>

      <div className="builds-grid">
        {displayedProjects.map((project, i) => (
          <div key={i} className="card build-card reveal">
            <div className="project-image-container">
              {project.previewImage ? (
                <img src={project.previewImage} alt={project.title} className="project-image" />
              ) : (
                <div className="no-preview">
                  <span className="no-preview-text">No Preview Available</span>
                </div>
              )}
            </div>
            <h3 className="card-title" style={{ marginTop: '1.25rem' }}>{project.title}</h3>
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
      
      {projects?.length > 6 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
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
