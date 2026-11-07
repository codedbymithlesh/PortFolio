import { useLayoutEffect } from 'react';

/**
 * Adds the reveal class and observes every [data-reveal] node in the document.
 * The key keeps the observer in sync when the public route or content changes.
 */
export default function useReveal(enabled, key) {
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const root = document.documentElement;

    if (!enabled) {
      root.classList.remove('reveal-enabled');
      return undefined;
    }

    if (!('IntersectionObserver' in window)) return undefined;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.classList.remove('reveal-enabled');
      return undefined;
    }

    root.classList.add('reveal-enabled');

    const nodes = Array.from(document.querySelectorAll('[data-reveal]'))
      .filter((node) => !node.classList.contains('is-visible'));

    if (nodes.length === 0) return undefined;

    const markVisible = (node) => node.classList.add('is-visible');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        markVisible(entry.target);
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });

    nodes.forEach((node) => {
      const rect = node.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
        window.requestAnimationFrame(() => markVisible(node));
      } else {
        observer.observe(node);
      }
    });

    const fallback = window.setTimeout(() => {
      nodes.forEach(markVisible);
      observer.disconnect();
    }, 2200);

    return () => {
      window.clearTimeout(fallback);
      observer.disconnect();
    };
  }, [enabled, key]);
}
