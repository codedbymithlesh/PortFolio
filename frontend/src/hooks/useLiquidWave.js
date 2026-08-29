import { useEffect } from 'react';

export default function useLiquidWave() {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(hover: none)').matches;
    if (prefersReduced || isTouch) return;

    let currentCard = null;
    let rafId = null;

    const onMouseMove = (e) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const card = e.target.closest('.liquid-wave');
        if (card !== currentCard) {
          currentCard = card;
        }
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--lw-x', `${x}%`);
        card.style.setProperty('--lw-y', `${y}%`);
      });
    };

    const onMouseLeave = (e) => {
      const card = e.target.closest('.liquid-wave');
      if (card) {
        currentCard = null;
      }
    };

    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave, { passive: true });
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);
}
