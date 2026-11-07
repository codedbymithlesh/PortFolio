import { Fragment, memo, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import { isUsableExternalUrl } from '../lib/links';
import useProjectsMotion from '../hooks/useProjectsMotion';
import DecodeText from './DecodeText';

/** Domain shown in the browser-frame bar, taken from the project's real destination. */
function frameDomain(project) {
  let source = '';

  if (isUsableExternalUrl(project.link)) source = project.link;
  else if (isUsableExternalUrl(project.codeLink)) source = project.codeLink;

  if (!source) return '';

  try {
    return new URL(source).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

/**
 * Serif title split into word masks. The real text stays in the DOM (spaces are
 * normal sibling text nodes) so assistive tech and text selection are intact;
 * only the transform is driven by GSAP.
 */
function ProjectTitle({ text }) {
  const words = String(text || '').split(/\s+/).filter(Boolean);

  return (
    <h3 className="work-item__title">
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          {index > 0 ? ' ' : null}
          <span className="split-word">
            <span className="split-word__inner">{word}</span>
          </span>
        </Fragment>
      ))}
    </h3>
  );
}

function ProjectMedia({ project, index, destination }) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(project.previewImage) && !failed;
  const number = String(index + 1).padStart(2, '0');
  const domain = frameDomain(project);

  return (
    <div className="work-item__media">
      <div className="work-frame">
        <div className="work-frame__bar" aria-hidden="true">
          <span className="work-frame__dots">
            <span />
            <span />
            <span />
          </span>
          <span className="work-frame__url">{domain || project.title}</span>
        </div>

        <div className="work-frame__viewport">
          {showImage ? (
            <img
              className="work-frame__img"
              src={project.previewImage}
              alt={`${project.title} project preview`}
              loading="lazy"
              decoding="async"
              onError={() => setFailed(true)}
            />
          ) : (
            <div className="work-item__placeholder">
              <span>{number}</span>
            </div>
          )}
        </div>
      </div>

      {destination && (
        <a
          className="work-item__arrow"
          href={destination}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${project.title}`}
        >
          <span aria-hidden="true">↗</span>
        </a>
      )}
    </div>
  );
}

const Projects = memo(() => {
  const rootRef = useRef(null);
  const { portfolio } = usePortfolio();
  const { projects } = portfolio;

  const displayedProjects = useMemo(
    () => [...(projects || [])].reverse().slice(0, 5),
    [projects],
  );

  useProjectsMotion(rootRef, displayedProjects.length);

  if (displayedProjects.length === 0) {
    return <p className="empty-state">No projects have been published yet.</p>;
  }

  return (
    <div className="work" ref={rootRef}>
      <ol className="work-list">
        {displayedProjects.map((project, index) => {
          const hasLiveLink = isUsableExternalUrl(project.link);
          const hasCodeLink = isUsableExternalUrl(project.codeLink);
          const destination = hasLiveLink
            ? project.link
            : hasCodeLink
              ? project.codeLink
              : '';
          const tech = Array.isArray(project.tech)
            ? project.tech.filter(Boolean)
            : [];
          const isAlt = index % 2 === 1;

          return (
            <li
              key={`${project.title}-${index}`}
              className={`work-item ${isAlt ? 'work-item--alt' : ''}`.trim()}
            >
              <ProjectMedia
                project={project}
                index={index}
                destination={destination}
              />

              <div className="work-item__content">
                <div className="work-item__meta">
                  <span className="work-item__index" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  {tech.length > 0 && (
                    <span className="work-item__category">{tech.join(' / ')}</span>
                  )}
                </div>

                <ProjectTitle text={project.title} />

                {project.description && (
                  <p className="work-item__desc">{project.description}</p>
                )}

                <div className="work-item__links">
                  {destination ? (
                    <a
                      href={destination}
                      className="work-item__link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <DecodeText>Explore the project</DecodeText>
                      <span aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    <span className="work-item__private">Private project</span>
                  )}

                  {hasCodeLink && destination !== project.codeLink && (
                    <a
                      href={project.codeLink}
                      className="work-item__link work-item__link--muted"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <DecodeText>Source code</DecodeText>
                      <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="work__footer">
        <Link to="/all-projects" className="work__archive-link">
          <DecodeText>View full project archive</DecodeText>
          <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </div>
  );
});

export default Projects;
