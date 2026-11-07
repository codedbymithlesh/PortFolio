import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaExternalLinkAlt, FaCode } from 'react-icons/fa';
import { usePortfolio } from '../context/PortfolioContext';
import { isUsableExternalUrl } from '../lib/links';
import DecodeText from '../components/DecodeText';

function ArchiveMedia({ project, index }) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(project.previewImage) && !failed;
  const number = String(index + 1).padStart(2, '0');

  return (
    <div className="archive-row__media">
      {showImage ? (
        <img
          src={project.previewImage}
          alt={`${project.title} project preview`}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="archive-row__placeholder" aria-hidden="true">
          {number}
        </div>
      )}
    </div>
  );
}

const Projects = () => {
  const { portfolio } = usePortfolio();
  const allProjects = React.useMemo(
    () => [...(portfolio.projects || [])].reverse(),
    [portfolio.projects],
  );
  const [visibleCount, setVisibleCount] = useState(6);
  const observerTarget = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < allProjects.length) {
          setVisibleCount((previous) => previous + 3);
        }
      },
      { threshold: 0.1 },
    );

    if (observerTarget.current) observer.observe(observerTarget.current);

    return () => observer.disconnect();
  }, [visibleCount, allProjects.length]);

  const displayedProjects = allProjects.slice(0, visibleCount);

  return (
    <div className="page-shell page-shell--archive">
      <div className="container">
        <header className="archive__header">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">All projects</span>
          </nav>

          <h1 className="archive__title">All projects</h1>

          <p className="archive__lede">
            The complete project archive currently published in the portfolio.
          </p>
        </header>

        {displayedProjects.length > 0 ? (
          <ol className="archive-list">
            {displayedProjects.map((project, index) => {
              const hasLiveLink = isUsableExternalUrl(project.link);
              const hasCodeLink = isUsableExternalUrl(project.codeLink);

              return (
                <li
                  key={`${project.title}-${index}`}
                  className="archive-row"
                  style={{ '--row-index': index }}
                >
                  <span className="archive-row__index" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <ArchiveMedia project={project} index={index} />

                  <div className="archive-row__body">
                    <h2 className="archive-row__title">{project.title}</h2>

                    {project.description && (
                      <p className="archive-row__desc">{project.description}</p>
                    )}

                    {Array.isArray(project.tech) && project.tech.length > 0 && (
                      <ul className="archive-row__tags">
                        {project.tech.map((tech, techIndex) => (
                          <li key={`${tech}-${techIndex}`} className="archive-row__tag">
                            {tech}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="archive-row__actions">
                      {hasLiveLink && (
                        <a
                          href={project.link}
                          className="text-link"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaExternalLinkAlt aria-hidden="true" />
                          <DecodeText>Live site</DecodeText>
                        </a>
                      )}

                      {hasCodeLink && (
                        <a
                          href={project.codeLink}
                          className="text-link"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaCode aria-hidden="true" />
                          <DecodeText>Source code</DecodeText>
                        </a>
                      )}

                      {!hasLiveLink && !hasCodeLink && (
                        <span className="work-item__private">Private project</span>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        ) : (
          <p className="empty-state">The archive is currently empty.</p>
        )}

        <div
          ref={observerTarget}
          className="archive-sentinel"
          aria-hidden={visibleCount >= allProjects.length}
        >
          {visibleCount < allProjects.length && <div className="archive-spinner" />}
        </div>

        <Link to="/" className="page-back">
          <FaArrowLeft aria-hidden="true" />
          <DecodeText>Back to home</DecodeText>
        </Link>
      </div>
    </div>
  );
};

export default Projects;
