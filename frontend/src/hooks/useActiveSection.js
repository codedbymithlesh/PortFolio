import { useEffect, useState } from 'react';

export default function useActiveSection(ids) {
  const [activeId, setActiveId] = useState(ids[0] || '');

  useEffect(() => {
    if (!ids.length) return undefined;

    let frame = 0;

    const update = () => {
      frame = 0;

      const marker = window.scrollY + Math.min(window.innerHeight * 0.35, 280);
      let current = ids[0];

      ids.forEach((id) => {
        const element = document.getElementById(id);
        if (!element) return;

        const top = element.getBoundingClientRect().top + window.scrollY;
        if (top <= marker) current = id;
      });

      const atBottom = window.innerHeight + window.scrollY
        >= document.documentElement.scrollHeight - 4;

      if (atBottom) current = ids[ids.length - 1];
      setActiveId((previous) => (previous === current ? previous : current));
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, [ids]);

  return ids.length ? activeId : '';
}
