import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaExternalLinkAlt, FaCode } from 'react-icons/fa';
import { usePortfolio } from '../context/PortfolioContext';

const FeaturedBuilds = React.memo(() => {
  const { portfolio } = usePortfolio();
  const { projects } = portfolio;
  const displayedProjects = React.useMemo(() => [...(projects || [])].reverse().slice(0, 5), [projects]);

  return (
    <section id="builds" className="showcase-section mt-5">
      <div className="section-header-centered reveal">
        <span className="section-overline">Selected Works</span>
        <h2 className="section-title massive">Portfolio Showcase</h2>
      </div>

      <div className="showcase-list">
        {displayedProjects.map((project, i) => {
          const isEven = i % 2 === 0;
          return (
            <div key={i} className={`showcase-item reveal ${isEven ? 'even' : 'odd'}`}>
              <div className="showcase-image-container">
                <div className="showcase-image-wrapper">
                  {project.previewImage ? (
                    <img src={project.previewImage} alt={project.title} className="showcase-image" />
                  ) : (
                    <div className="no-preview showcase-no-preview">
                      <span className="no-preview-text">Masterpiece in Progress</span>
                    </div>
                  )}
                  <div className="showcase-overlay"></div>
                </div>
              </div>

              <div className="showcase-content">
                <div className="showcase-text-box">
                  <h3 className="showcase-title">{project.title}</h3>
                  <div className="showcase-tags">
                    {(project.tech || []).map((t, j) => (
                      <span key={j} className="showcase-tag">{t}</span>
                    ))}
                  </div>
                  <p className="showcase-desc">{project.description}</p>
                  
                  <div className="showcase-actions">
                    {project.link && project.link !== '#' ? (
                      <a href={project.link} className="showcase-btn primary" target="_blank" rel="noopener noreferrer">
                        <FaExternalLinkAlt /> Live Demo
                      </a>
                    ) : (
                      <span className="showcase-btn disabled"><FaExternalLinkAlt /> Private</span>
                    )}

                    {project.codeLink && project.codeLink !== '#' ? (
                      <a href={project.codeLink} className="showcase-btn secondary" target="_blank" rel="noopener noreferrer">
                        <FaCode /> Source Code
                      </a>
                    ) : (
                      <span className="showcase-btn disabled"><FaCode /> Private</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {projects?.length > 5 && (
        <div className="showcase-footer reveal">
          <Link to="/all-projects" className="all-projects-btn">
            All Projects <FaArrowRight className="ml-2" />
          </Link>
        </div>
      )}
    </section>
  );
});

export default FeaturedBuilds;
