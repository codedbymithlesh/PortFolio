import React, { useEffect, useRef, useCallback } from 'react';

const TechnicalBackground = React.memo(() => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const scrollRef = useRef(0);
  const maxScrollRef = useRef(1);
  const sectionRef = useRef('home');
  const targetSectionRef = useRef('home');
  const sectionBlend = useRef({ from: 'home', to: 'home', t: 1 });
  const rafRef = useRef(null);
  const nodesRef = useRef([]);
  const isDesktopRef = useRef(window.innerWidth > 768);

  const NODE_COUNT = isDesktopRef.current ? 60 : 24;
  const CONNECTION_DIST = isDesktopRef.current ? 170 : 120;
  const MOUSE_RADIUS = isDesktopRef.current ? 200 : 0;

  const sectionHues = {
    home:      { r: 76,  g: 193, b: 170 },
    about:     { r: 86,  g: 156, b: 214 },
    skills:    { r: 76,  g: 193, b: 170 },
    projects:  { r: 109, g: 212, b: 190 },
    contact:   { r: 86,  g: 156, b: 214 },
  };

  const lerpColor = (a, b, t) => ({
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t,
  });

  const createNodes = useCallback((w, h) => {
    const nodes = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.15 + Math.random() * 0.35;
      nodes.push({
        baseX: Math.random() * w,
        baseY: Math.random() * h,
        x: 0, y: 0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 2.5 + 1.0,
        opacity: Math.random() * 0.5 + 0.25,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.3 + Math.random() * 0.5,
        scrollMultiplier: 0.3 + Math.random() * 0.7,
        driftAmplitudeX: 20 + Math.random() * 60,
        driftAmplitudeY: 15 + Math.random() * 50,
        driftSpeedX: 0.2 + Math.random() * 0.4,
        driftSpeedY: 0.15 + Math.random() * 0.35,
        driftPhaseX: Math.random() * Math.PI * 2,
        driftPhaseY: Math.random() * Math.PI * 2,
      });
    }
    return nodes;
  }, [NODE_COUNT]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = window.innerWidth;
    let h = window.innerHeight;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };
    resize();
    nodesRef.current = createNodes(w, h);

    const detectSection = () => {
      const sectionIds = ['home', 'projects', 'skills', 'about', 'contact'];
      const viewCenter = window.scrollY + h * 0.4;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        const bottom = top + el.offsetHeight;
        if (viewCenter >= top && viewCenter < bottom) {
          if (targetSectionRef.current !== id) {
            sectionBlend.current = { from: sectionRef.current, to: id, t: 0 };
            targetSectionRef.current = id;
          }
          return;
        }
      }
    };

    const onMouseMove = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    let scrollTicking = false;
    const onScroll = () => {
      scrollRef.current = window.scrollY;
      maxScrollRef.current = Math.max(document.documentElement.scrollHeight - h, 1);
      if (!scrollTicking) {
        requestAnimationFrame(() => {
          detectSection();
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    };
    const onResize = () => { resize(); };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    onScroll();

    const gridOverlay = document.querySelector('.tech-bg-grid');
    let time = 0;

    const animate = () => {
      time += 0.016;
      ctx.clearRect(0, 0, w, h);

      const scrollProgress = scrollRef.current / maxScrollRef.current;
      const scrollY = scrollRef.current;

      sectionBlend.current.t = Math.min(sectionBlend.current.t + 0.025, 1);
      sectionRef.current = targetSectionRef.current;

      const fromHue = sectionHues[sectionBlend.current.from] || sectionHues.home;
      const toHue = sectionHues[sectionBlend.current.to] || sectionBlend.current.from === sectionBlend.current.to ? fromHue : sectionHues.home;
      const blendT = sectionBlend.current.t;
      const curHue = lerpColor(fromHue, toHue, blendT);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const nodes = nodesRef.current;

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

      const autoX = Math.sin(time * n.driftSpeedX + n.driftPhaseX) * n.driftAmplitudeX;
      const autoY = Math.cos(time * n.driftSpeedY + n.driftPhaseY) * n.driftAmplitudeY;
      const scrollOffset = scrollY * n.scrollMultiplier * 0.15;

      let mouseDx = 0, mouseDy = 0;
      if (MOUSE_RADIUS > 0) {
        const dmx = mx - (n.baseX + autoX);
        const dmy = my - (n.baseY + autoY - scrollOffset);
        const dm = Math.sqrt(dmx * dmx + dmy * dmy);
        if (dm < MOUSE_RADIUS && dm > 1) {
          const force = (1 - dm / MOUSE_RADIUS) * 15;
          mouseDx = -(dmx / dm) * force;
          mouseDy = -(dmy / dm) * force;
        }
      }

      n.x = n.baseX + autoX + mouseDx;
      n.y = ((n.baseY + autoY - scrollOffset + mouseDy) % (h + 100) + h + 100) % (h + 100) - 50;

      const pulse = Math.sin(time * n.pulseSpeed + n.pulsePhase) * 0.2 + 0.8;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${Math.round(curHue.r)}, ${Math.round(curHue.g)}, ${Math.round(curHue.b)}, ${n.opacity * pulse})`;
      ctx.fill();
    }

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) {
          const alpha = (1 - dist / CONNECTION_DIST) * 0.2;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${Math.round(curHue.r)}, ${Math.round(curHue.g)}, ${Math.round(curHue.b)}, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [createNodes, CONNECTION_DIST, MOUSE_RADIUS]);

  return (
    <>
      <div className="tech-bg-grid" />
      <canvas ref={canvasRef} className="tech-bg-canvas" />
      <div className="tech-bg-spotlight" />
      <div className="tech-bg-vignette" />
    </>
  );
});

export default TechnicalBackground;
