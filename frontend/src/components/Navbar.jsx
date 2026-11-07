import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import { PATH_TO_SECTION, SECTION_IDS, SECTION_LINKS } from '../lib/navigation';
import { getInitials } from '../lib/text';
import useActiveSection from '../hooks/useActiveSection';
import useDecodeText from '../hooks/useDecodeText';
import SectionLink from './SectionLink';
import DecodeText from './DecodeText';

const NO_SECTIONS = [];

const NavItem = ({ item, index, active, onNavigate }) => {
  const hostRef = useRef(null);
  const binaryRef = useRef(null);
  useDecodeText(item.label, hostRef, binaryRef);

  return (
    <li>
      <SectionLink
        section={item.id}
        className={`site-nav__link ${active ? 'is-active' : ''}`.trim()}
        aria-current={active ? 'location' : undefined}
        onNavigate={onNavigate}
      >
        <span className="site-nav__index" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="nav-decode" ref={hostRef}>
          <span className="nav-decode__label">{item.label}</span>
          <span className="nav-decode__binary" aria-hidden="true" ref={binaryRef}>
            {item.label}
          </span>
        </span>
      </SectionLink>
    </li>
  );
};

const Navbar = React.memo(() => {
  const { portfolio } = usePortfolio();
  const { hero } = portfolio;
  const location = useLocation();
  const locationKey = `${location.pathname}${location.hash}`;
  const [menu, setMenu] = useState({ at: locationKey, open: false });
  let menuOpen = menu.open && menu.at === locationKey;
  if (menu.at !== locationKey) {
    menuOpen = false;
    setMenu({ at: locationKey, open: false });
  }
  const toggleRef = useRef(null);
  const onSectionRoute = Boolean(PATH_TO_SECTION[location.pathname]);
  const activeSection = useActiveSection(onSectionRoute ? SECTION_IDS : NO_SECTIONS);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key !== 'Escape') return;
      setMenu((state) => ({ ...state, open: false }));
      toggleRef.current?.focus();
    };

    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  const closeMenu = () => setMenu((state) => ({ ...state, open: false }));

  return (
    <header className={`site-header ${menuOpen ? 'is-open' : ''}`.trim()}>
      <div className="container site-header__inner">
        <SectionLink
          section="home"
          className="brand"
          aria-label={`${hero.name || 'Portfolio'} home`}
          onNavigate={closeMenu}
        >
          <span className="brand__mark" aria-hidden="true">
            {getInitials(hero.name)}
          </span>
          <span className="brand__text">
            <span className="brand__name">{hero.name || 'Portfolio'}</span>
            <span className="brand__meta">{hero.subtitle || 'Developer portfolio'}</span>
          </span>
        </SectionLink>

        <nav className="site-nav" aria-label="Primary">
          <button
            ref={toggleRef}
            type="button"
            className={`site-nav__toggle ${menuOpen ? 'is-open' : ''}`.trim()}
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            onClick={() => setMenu((state) => (
              state.open && state.at === locationKey
                ? { ...state, open: false }
                : { at: locationKey, open: true }
            ))}
          >
            <DecodeText>{menuOpen ? 'Close' : 'Menu'}</DecodeText>
            <span className="site-nav__toggle-icon" aria-hidden="true">
              <span />
              <span />
            </span>
          </button>

          <div
            id="primary-navigation"
            className={`site-nav__panel ${menuOpen ? 'is-open' : ''}`.trim()}
          >
            <ul className="site-nav__list">
              {SECTION_LINKS.map((item, index) => (
                <NavItem
                  key={item.id}
                  item={item}
                  index={index}
                  active={activeSection === item.id}
                  onNavigate={closeMenu}
                />
              ))}
            </ul>

            <p className="site-nav__foot">
              {hero.subtitle || 'Developer portfolio'}
            </p>
          </div>
        </nav>
      </div>
    </header>
  );
});

export default Navbar;
