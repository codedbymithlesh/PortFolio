import { FaGithub, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { usePortfolio } from '../context/PortfolioContext';
import { SECTION_LINKS, scrollToTop } from '../lib/navigation';
import { isUsableExternalUrl } from '../lib/links';
import SectionLink from './SectionLink';
import DecodeText from './DecodeText';

const SOCIALS = [
  { key: 'github', label: 'GitHub', icon: FaGithub },
  { key: 'linkedin', label: 'LinkedIn', icon: FaLinkedin },
  { key: 'youtube', label: 'YouTube', icon: FaYoutube },
];

export default function Footer() {
  const { portfolio } = usePortfolio();
  const { hero, contact } = portfolio;
  const year = new Date().getFullYear();

  const socials = SOCIALS.filter(({ key }) => isUsableExternalUrl(contact[key]));

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__top">
          <SectionLink section="home" className="site-footer__name">
            {hero.name || 'Portfolio'}
          </SectionLink>

          <nav className="site-footer__nav" aria-label="Footer">
            <ul>
              {SECTION_LINKS.map((item) => (
                <li key={item.id}>
                  <SectionLink section={item.id}>
                    <DecodeText>{item.label}</DecodeText>
                  </SectionLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="site-footer__bottom">
          <p className="site-footer__copyright">
            © {year} {hero.name || 'Portfolio'}
          </p>

          {contact.location && (
            <p className="site-footer__location">{contact.location}</p>
          )}

          <div className="site-footer__actions">
            {socials.length > 0 && (
              <ul className="site-footer__socials">
                {socials.map(({ key, label, icon: Icon }) => (
                  <li key={key}>
                    <a
                      href={contact[key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${label} profile`}
                    >
                      <Icon aria-hidden="true" />
                      <DecodeText>{label}</DecodeText>
                    </a>
                  </li>
                ))}
              </ul>
            )}

            <button
              type="button"
              className="site-footer__top-link"
              onClick={() => scrollToTop()}
            >
              <DecodeText>Back to top</DecodeText>
              <span aria-hidden="true">↑</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
