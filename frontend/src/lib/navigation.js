import { getLenis } from '../hooks/useLenis';

export const SECTION_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'work', label: 'Work' },
  { id: 'journey', label: 'Journey' },
  { id: 'contact', label: 'Contact' },
];

export const SECTION_IDS = SECTION_LINKS.map((item) => item.id);

export const PATH_TO_SECTION = {
  '/': 'home',
  '/about': 'about',
  '/skills': 'capabilities',
  '/projects': 'work',
  '/contact': 'contact',
};

export function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

export function scrollToSection(id, { behavior } = {}) {
  if (typeof document === 'undefined') return false;

  const target = document.getElementById(id);
  if (!target) return false;

  const lenis = getLenis();

  if (lenis) {
    lenis.scrollTo(`#${id}`, {
      immediate: behavior === 'auto' || prefersReducedMotion(),
      force: true,
    });
    return true;
  }

  target.scrollIntoView({
    behavior: behavior || (prefersReducedMotion() ? 'auto' : 'smooth'),
    block: 'start',
  });

  return true;
}

export function scrollToTop({ behavior } = {}) {
  if (typeof window === 'undefined') return;

  const lenis = getLenis();

  if (lenis) {
    lenis.scrollTo(0, {
      immediate: behavior === 'auto' || prefersReducedMotion(),
      force: true,
    });
    return;
  }

  window.scrollTo({
    top: 0,
    behavior: behavior || (prefersReducedMotion() ? 'auto' : 'smooth'),
  });
}
