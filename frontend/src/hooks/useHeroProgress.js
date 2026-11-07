import { useEffect } from 'react';

/**
 * Tracks how far the next chapter has entered the viewport.
 *
 * Progress is 0 while the About section sits at the bottom edge of the
 * viewport and reaches 1 once its top has risen to 35% of the viewport. The
 * value is mirrored to a CSS custom property (`--hero-p`) so the portrait
 * mask can dissolve into the background without re-rendering React.
 */
export default function useHeroProgress(sectionRef) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    let last = -1;

    const measure = () => {
      const nextChapter = section.nextElementSibling;
      let progress;

      if (nextChapter) {
        const viewport = window.innerHeight;
        const start = viewport;
        const end = viewport * 0.35;
        const nextTop = nextChapter.getBoundingClientRect().top;
        progress = (start - nextTop) / Math.max(1, start - end);
      } else {
        const rect = section.getBoundingClientRect();
        progress = -rect.top / Math.max(1, rect.height - window.innerHeight);
      }

      progress = Math.min(1, Math.max(0, progress));

      if (Math.abs(progress - last) < 0.0005) return;
      last = progress;
      section.style.setProperty('--hero-p', progress.toFixed(4));
    };

    measure();
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);

    return () => {
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
      section.style.removeProperty('--hero-p');
    };
  }, [sectionRef]);
}
