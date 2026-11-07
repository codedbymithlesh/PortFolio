import React, { useEffect, useRef, useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { getInitials } from '../lib/text';
import SectionLink from './SectionLink';
import DecodeText from './DecodeText';
import useHeroProgress from '../hooks/useHeroProgress';

const Hero = React.memo(() => {
  const { portfolio, loading } = usePortfolio();
  const { hero, contact } = portfolio;
  const [imageFailed, setImageFailed] = useState(false);
  const [entered, setEntered] = useState(false);
  const heroRef = useRef(null);
  // Mirrors scroll progress to `--hero-p` for the portrait's bottom dissolve.
  useHeroProgress(heroRef);

  useEffect(() => {
    setImageFailed(false);
  }, [hero.profileImage]);

  useEffect(() => {
    if (loading) return undefined;

    let firstFrame = 0;
    let secondFrame = 0;

    firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => setEntered(true));
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
    };
  }, [loading]);

  const showPortrait = Boolean(hero.profileImage) && !imageFailed;
  const displayName = hero.name || 'Portfolio';
  const nameParts = String(displayName).trim().split(/\s+/);
  const nameLineOne = nameParts[0] || displayName;
  const nameLineTwo = nameParts.slice(1).join(' ');
  const year = new Date().getFullYear();

  return (
    <section
      id="home"
      ref={heroRef}
      className={`hero ${entered ? 'is-entered' : ''}`.trim()}
      aria-labelledby="hero-title"
    >
      <div className="hero__sticky">
        <div className="hero__atmosphere" aria-hidden="true">
          <span className="hero__glow" />
          <span className="hero__glow hero__glow--low" />
        </div>

        <div className="hero__portrait">
          <div className="hero__portrait-media">
            {showPortrait ? (
              <img
                src={hero.profileImage}
                alt={hero.name ? `Portrait of ${hero.name}` : 'Portfolio portrait'}
                loading="eager"
                fetchPriority="high"
                onError={() => setImageFailed(true)}
              />
            ) : (
              <div className="hero__portrait-fallback">
                <span className="hero__initials" aria-hidden="true">
                  {getInitials(hero.name)}
                </span>
                <span className="hero__portrait-note">Portrait forthcoming</span>
              </div>
            )}

          </div>
        </div>
      </div>

      <div className="container hero__inner">
        <div className="hero__intro">
          <span className="hero__intro-label">Full-stack developer</span>
          {contact.location && (
            <span className="hero__intro-location">{contact.location}</span>
          )}
        </div>

        <p className="hero__eyebrow hero__eyebrow--side">
          <span className="hero__eyebrow-index" aria-hidden="true">01</span>
          <span className="hero__eyebrow-text">{hero.subtitle || 'MERN Stack Developer | Creator | Learner'}</span>
        </p>

        <div className="hero__composition">
          <h1 id="hero-title" className="hero__title" aria-label={displayName}>
            <span className="hero__line">
              <span className="hero__line-inner">{nameLineOne}</span>
            </span>
            {nameLineTwo && (
              <>
                {' '}
                <span className="hero__line hero__line--two">
                  <span className="hero__line-inner">{nameLineTwo} </span>
                </span>
              </>
            )}
          </h1>
        </div>

        <div className="hero__lead">
          <p className="hero__statement">
            {hero.bio || 'A developer portfolio built around selected work, capabilities and a clear way to get in touch.'}
          </p>

          <div className="hero__actions">
            <SectionLink section="work" className="hero__cta">
              <DecodeText>Explore My Work</DecodeText>
              <span className="hero__cta-arrow" aria-hidden="true">↗</span>
            </SectionLink>
            <SectionLink section="contact" className="hero__cta hero__cta--ghost">
              <DecodeText>Let&rsquo;s Connect</DecodeText>
              <span className="hero__cta-arrow" aria-hidden="true">↗</span>
            </SectionLink>
          </div>
        </div>

        <div className="hero__meta">
          <span className="hero__meta-item">Portfolio {year}</span>

          <SectionLink
            section="about"
            className="hero__scroll-link"
            aria-label="Scroll to the about section"
          >
            <DecodeText>Scroll to explore</DecodeText>
            <span className="hero__scroll-line" aria-hidden="true">
              <span />
            </span>
          </SectionLink>
        </div>
      </div>
    </section>
  );
});

export default Hero;
