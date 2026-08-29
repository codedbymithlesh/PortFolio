import React, { useEffect, useRef } from 'react';

const SECTION_COLORS = {
  home:      { r: 76,  g: 193, b: 170 },
  about:     { r: 60,  g: 180, b: 175 },
  skills:    { r: 80,  g: 220, b: 230 },
  projects:  { r: 130, g: 110, b: 220 },
  contact:   { r: 76,  g: 210, b: 155 },
};

const BRACKET_SIZE = 28;
const BRACKET_LINE = 7;
const BRACKET_WEIGHT = 1.4;
const IDLE_INSET = 6;
const IDLE_TIMEOUT = 2200;
const SCAN_DURATION = 1800;
const PULSE_DURATION = 420;

function lerp(a, b, t) { return a + (b - a) * t; }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

function detectSection() {
  const ids = ['contact', 'projects', 'skills', 'about', 'home'];
  for (const id of ids) {
    const el = document.getElementById(id === 'home' ? 'hero' : id);
    if (!el) continue;
    const r = el.getBoundingClientRect();
    if (r.top <= window.innerHeight * 0.5 && r.bottom >= window.innerHeight * 0.3) return id;
  }
  return 'home';
}

function isNav(el) {
  return el && el.closest('.nav-links a, .portfolio-bottom-item, .adm-nav-item, .adm-bottom-item, [data-cursor="nav"]');
}

function isExternalLink(el) {
  const anchor = el && el.closest('a[href]');
  if (!anchor) return false;
  if (anchor.getAttribute('target') === '_blank') return true;
  const href = anchor.getAttribute('href') || '';
  if (href.startsWith('http://') || href.startsWith('https://')) return true;
  return false;
}

function isTextInput(el) {
  return el && el.closest('input, textarea');
}

export default function CustomCursor() {
  const systemRef = useRef(null);
  const dotRef = useRef(null);
  const bracketRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const scanRef = useRef(null);
  const pulseRef = useRef(null);
  const labelRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  const mouse = useRef({ x: -200, y: -200 });
  const pos = useRef({ x: -200, y: -200 });
  const vel = useRef({ x: 0, y: 0, speed: 0, angle: 0 });
  const prev = useRef({ x: -200, y: -200, t: Date.now() });
  const spread = useRef({ x: 0, y: 0 });
  const targetSpread = useRef({ x: 0, y: 0 });
  const hoverState = useRef('none');
  const hoverElRect = useRef(null);
  const opacity = useRef(0);
  const visible = useRef(false);
  const raf = useRef(null);
  const lastMoveTime = useRef(Date.now());
  const idleTimer = useRef(null);
  const scanActive = useRef(false);
  const scanStart = useRef(0);
  const pulseQueue = useRef([]);
  const scrollDir = useRef(0);
  const scrollTimeout = useRef(null);
  const color = useRef({ ...SECTION_COLORS.home });
  const colorTarget = useRef({ ...SECTION_COLORS.home });
  const bracketOffset = useRef([
    { x: 0, y: 0 }, { x: 0, y: 0 },
    { x: 0, y: 0 }, { x: 0, y: 0 },
  ]);
  const coreScale = useRef(1);
  const targetCoreScale = useRef(1);
  const labelOpacity = useRef(0);
  const targetLabelOpacity = useRef(0);
  const labelText = useRef('');
  const magnetTarget = useRef(null);
  const magnetOffset = useRef({ x: 0, y: 0 });
  const prefersReduced = useRef(false);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(hover: none)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      prefersReduced.current = true;
    }

    document.body.classList.add('has-custom-cursor');

    const INTERACTIVE = 'a, button, input, textarea, [role="button"], [data-cursor]';

    const BRACKET_OFFSETS = [
      { x: -1, y: -1 },
      { x:  1, y: -1 },
      { x: -1, y:  1 },
      { x:  1, y:  1 },
    ];

    function startIdleScan() {
      if (scanActive.current || prefersReduced.current) return;
      scanActive.current = true;
      scanStart.current = performance.now();
    }

    function clearIdle() {
      lastMoveTime.current = Date.now();
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(startIdleScan, IDLE_TIMEOUT);
    }

    function spawnPulse() {
      pulseQueue.current.push(performance.now());
    }

    function onMove(e) {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      clearIdle();

      if (!visible.current) {
        visible.current = true;
        pos.current.x = e.clientX;
        pos.current.y = e.clientY;
      }

      const customCursor = e.target.closest?.('[data-cursor]');
      const customType = customCursor?.getAttribute('data-cursor');

      if (customType === 'open') {
        hoverState.current = 'open';
        const el = customCursor;
        hoverElRect.current = el.getBoundingClientRect();
        magnetTarget.current = el;
      } else if (customType === 'nav' || isNav(e.target)) {
        hoverState.current = 'nav';
        hoverElRect.current = null;
        magnetTarget.current = null;
      } else if (customType === 'action') {
        hoverState.current = 'action';
        hoverElRect.current = null;
        magnetTarget.current = null;
      } else if (customType === 'default') {
        hoverState.current = 'none';
        hoverElRect.current = null;
        magnetTarget.current = null;
      } else if (isExternalLink(e.target)) {
        hoverState.current = 'open';
        const anchor = e.target.closest('a[href]');
        hoverElRect.current = anchor?.getBoundingClientRect() || null;
        magnetTarget.current = anchor;
      } else if (isTextInput(e.target)) {
        hoverState.current = 'text';
        hoverElRect.current = null;
        magnetTarget.current = null;
      } else {
        hoverState.current = 'none';
        hoverElRect.current = null;
        magnetTarget.current = null;
      }
    }

    function onDown(e) {
      if (e.button !== 0) return;
      spawnPulse();
      if (!prefersReduced.current) {
        targetCoreScale.current = 0.3;
      }
    }

    function onUp() {
      targetCoreScale.current = 1;
    }

    function onDocEnter() { visible.current = true; }
    function onDocLeave() { visible.current = false; }

    let scrollAccum = 0;
    function onScroll() {
      const delta = window.scrollY;
      scrollDir.current = delta > 0 ? 1 : -1;
      scrollAccum++;
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => { scrollDir.current = 0; scrollAccum = 0; }, 180);
    }

    function animate(now) {
      const dt = Math.min((now - prev.current.t) / 16.67, 3);
      const dx = mouse.current.x - prev.current.x;
      const dy = mouse.current.y - prev.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const speed = dist / dt;

      vel.current.speed = lerp(vel.current.speed, speed, 0.15);
      if (dist > 0.5) {
        vel.current.angle = Math.atan2(dy, dx);
        vel.current.x = dx;
        vel.current.y = dy;
      }

      prev.current.x = mouse.current.x;
      prev.current.y = mouse.current.y;
      prev.current.t = now;

      const spd = vel.current.speed;
      const angle = vel.current.angle;

      const sec = detectSection();
      const nc = SECTION_COLORS[sec] || SECTION_COLORS.home;
      colorTarget.current = nc;
      color.current.r = lerp(color.current.r, colorTarget.current.r, 0.04);
      color.current.g = lerp(color.current.g, colorTarget.current.g, 0.04);
      color.current.b = lerp(color.current.b, colorTarget.current.b, 0.04);
      const c = color.current;

      const isIdle = (Date.now() - lastMoveTime.current) > IDLE_TIMEOUT;

      const moveThreshold = 3;
      if (!prefersReduced.current && spd > moveThreshold) {
        const amt = clamp((spd - moveThreshold) / 40, 0, 1);
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        targetSpread.current.x = lerp(targetSpread.current.x, cos * amt * 10, 0.08);
        targetSpread.current.y = lerp(targetSpread.current.y, sin * amt * 10, 0.08);
      } else if (isIdle && !prefersReduced.current) {
        targetSpread.current.x = lerp(targetSpread.current.x, 0, 0.05);
        targetSpread.current.y = lerp(targetSpread.current.y, 0, 0.05);
      } else {
        targetSpread.current.x = lerp(targetSpread.current.x, 0, 0.06);
        targetSpread.current.y = lerp(targetSpread.current.y, 0, 0.06);
      }

      spread.current.x = lerp(spread.current.x, targetSpread.current.x, 0.12);
      spread.current.y = lerp(spread.current.y, targetSpread.current.y, 0.12);

      coreScale.current = lerp(coreScale.current, targetCoreScale.current, 0.14);
      opacity.current = lerp(opacity.current, visible.current ? 1 : 0, 0.08);

      let bracketScale = 1;
      let bracketInset = 0;
      let showLabel = false;

      if (hoverState.current === 'open') {
        bracketScale = 1.12;
        showLabel = true;
        labelText.current = 'OPEN';
        targetLabelOpacity.current = 1;
      } else if (hoverState.current === 'nav') {
        bracketScale = 0.75;
        targetLabelOpacity.current = 0;
      } else if (hoverState.current === 'action') {
        bracketScale = 1.05;
        targetLabelOpacity.current = 0;
      } else {
        targetLabelOpacity.current = 0;
      }

      labelOpacity.current = lerp(labelOpacity.current, targetLabelOpacity.current, 0.12);

      if (isIdle && !prefersReduced.current) {
        bracketInset = lerp(bracketInset || 0, IDLE_INSET, 0.04);
      } else {
        bracketInset = lerp(bracketInset || 0, 0, 0.08);
      }

      const targetOp = visible.current ? 1 : 0;
      opacity.current = lerp(opacity.current, targetOp, 0.08);

      const posLerp = hoverState.current === 'open' || hoverState.current === 'nav' ? 0.16 : 0.13;
      pos.current.x = lerp(pos.current.x, mouse.current.x, posLerp);
      pos.current.y = lerp(pos.current.y, mouse.current.y, posLerp);

      if (magnetTarget.current) {
        const rect = magnetTarget.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const mdx = mouse.current.x - cx;
        const mdy = mouse.current.y - cy;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        const range = 80;
        if (mdist < range) {
          const pull = (1 - mdist / range) * 0.25;
          magnetOffset.current.x = lerp(magnetOffset.current.x, mdx * pull, 0.12);
          magnetOffset.current.y = lerp(magnetOffset.current.y, mdy * pull, 0.12);
          magnetTarget.current.style.transform = `translate(${magnetOffset.current.x}px, ${magnetOffset.current.y}px)`;
        } else {
          magnetOffset.current.x = lerp(magnetOffset.current.x, 0, 0.08);
          magnetOffset.current.y = lerp(magnetOffset.current.y, 0, 0.08);
          if (magnetTarget.current) {
            magnetTarget.current.style.transform = `translate(${magnetOffset.current.x}px, ${magnetOffset.current.y}px)`;
          }
        }
      } else if (Math.abs(magnetOffset.current.x) > 0.1 || Math.abs(magnetOffset.current.y) > 0.1) {
        magnetOffset.current.x = lerp(magnetOffset.current.x, 0, 0.08);
        magnetOffset.current.y = lerp(magnetOffset.current.y, 0, 0.08);
      }

      const op = opacity.current;
      const px = pos.current.x;
      const py = pos.current.y;
      const half = BRACKET_SIZE / 2;

      if (systemRef.current) {
        systemRef.current.style.transform = `translate3d(${px}px, ${py}px, 0)`;
        systemRef.current.style.opacity = op;
      }

      if (dotRef.current) {
        const ds = coreScale.current;
        dotRef.current.style.transform = `translate3d(-2.5px, -2.5px, 0) scale(${ds})`;
        dotRef.current.style.opacity = op;
        dotRef.current.style.backgroundColor = `rgb(${Math.round(c.r)},${Math.round(c.g)},${Math.round(c.b)})`;
        dotRef.current.style.boxShadow = `0 0 ${4 + spd * 0.02}px rgba(${Math.round(c.r)},${Math.round(c.g)},${Math.round(c.b)},0.5)`;
      }

      const spreadX = spread.current.x;
      const spreadY = spread.current.y;
      const inset = bracketInset;
      const bs = bracketScale;
      const lw = BRACKET_WEIGHT;
      const bl = BRACKET_LINE * bs;

      for (let i = 0; i < 4; i++) {
        const el = bracketRefs[i].current;
        if (!el) continue;
        const bx = BRACKET_OFFSETS[i].x;
        const by = BRACKET_OFFSETS[i].y;
        const ox = bx * (half + inset) + spreadX * bx;
        const oy = by * (half + inset) + spreadY * by;

        bracketOffset.current[i].x = lerp(bracketOffset.current[i].x, ox, 0.14);
        bracketOffset.current[i].y = lerp(bracketOffset.current[i].y, oy, 0.14);

        const cx = bracketOffset.current[i].x;
        const cy = bracketOffset.current[i].y;
        const cornerOpacity = (hoverState.current === 'open' || hoverState.current === 'action') ? clamp(op + 0.15, 0, 1) : op;

        el.style.transform = `translate3d(${cx - bl / 2}px, ${cy - bl / 2}px, 0)`;
        el.style.opacity = cornerOpacity;
        el.style.width = `${bl}px`;
        el.style.height = `${bl}px`;
        el.style.borderWidth = `${lw}px`;
        el.style.borderColor = `rgba(${Math.round(c.r)},${Math.round(c.g)},${Math.round(c.b)},${hoverState.current === 'open' ? 0.75 : hoverState.current === 'nav' ? 0.45 : 0.5})`;
        el.style.borderRadius = hoverState.current === 'nav' ? '2px' : '0';

        const borderTop = (i < 2) ? 'solid' : 'none';
        const borderBottom = (i >= 2) ? 'solid' : 'none';
        const borderLeft = (i % 2 === 0) ? 'solid' : 'none';
        const borderRight = (i % 2 === 1) ? 'solid' : 'none';
        el.style.borderTop = borderTop;
        el.style.borderBottom = borderBottom;
        el.style.borderLeft = borderLeft;
        el.style.borderRight = borderRight;
      }

      if (scanRef.current) {
        if (scanActive.current && !prefersReduced.current) {
          const elapsed = now - scanStart.current;
          const progress = (elapsed % SCAN_DURATION) / SCAN_DURATION;
          if (elapsed > SCAN_DURATION) {
            scanActive.current = false;
            scanRef.current.style.opacity = 0;
          } else {
            const angle = progress * 360;
            const pulse = Math.sin(progress * Math.PI) * 0.3;
            scanRef.current.style.opacity = clamp(op * (0.25 + pulse), 0, 0.5);
            scanRef.current.style.transform = `rotate(${angle}deg)`;
          }
        } else {
          scanRef.current.style.opacity = lerp(parseFloat(scanRef.current.style.opacity || 0), 0, 0.1);
        }
      }

      const cr = Math.round(c.r);
      const cg = Math.round(c.g);
      const cb = Math.round(c.b);

      pulseQueue.current = pulseQueue.current.filter(startTime => {
        const elapsed = now - startTime;
        if (elapsed > PULSE_DURATION) return false;
        const progress = elapsed / PULSE_DURATION;
        const ringOp = (1 - progress) * 0.5;
        const ringScale = 1 + progress * 2.5;
        if (pulseRef.current) {
          pulseRef.current.style.opacity = ringOp * op;
          pulseRef.current.style.transform = `translate3d(-12px, -12px, 0) scale(${ringScale})`;
          pulseRef.current.style.borderColor = `rgba(${cr},${cg},${cb},${ringOp})`;
        }
        return true;
      });
      if (pulseQueue.current.length === 0 && pulseRef.current) {
        pulseRef.current.style.opacity = 0;
      }

      if (labelRef.current) {
        if (labelOpacity.current > 0.01) {
          labelRef.current.style.opacity = labelOpacity.current * op;
          labelRef.current.textContent = labelText.current;
          const labelColor = hoverState.current === 'open'
            ? `rgba(${cr},${cg},${cb},0.9)`
            : `rgba(${cr},${cg},${cb},0.7)`;
          labelRef.current.style.color = labelColor;
          let lx = 14;
          let ly = -14;
          if (hoverState.current === 'open') {
            lx = 16;
            ly = -8;
          }
          labelRef.current.style.transform = `translate3d(${lx}px, ${ly}px, 0)`;
        } else {
          labelRef.current.style.opacity = 0;
        }
      }

      if (scrollIndicatorRef.current) {
        if (scrollDir.current !== 0 && !prefersReduced.current) {
          const sOp = clamp(Math.abs(vel.current.speed) / 30, 0, 0.6);
          scrollIndicatorRef.current.style.opacity = sOp * op;
          scrollIndicatorRef.current.style.transform = `translate3d(-4px, ${scrollDir.current * -14}px, 0)`;
          scrollIndicatorRef.current.style.color = `rgba(${cr},${cg},${cb},0.7)`;
          scrollIndicatorRef.current.textContent = scrollDir.current > 0 ? '↓' : '↑';
        } else {
          scrollIndicatorRef.current.style.opacity = lerp(parseFloat(scrollIndicatorRef.current.style.opacity || 0), 0, 0.1);
        }
      }

      raf.current = requestAnimationFrame(animate);
    }

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseenter', onDocEnter);
    document.addEventListener('mouseleave', onDocLeave);
    document.addEventListener('mousedown', onDown, { passive: true });
    document.addEventListener('mouseup', onUp, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    raf.current = requestAnimationFrame(animate);
    clearIdle();

    const addHover = () => {
      document.querySelectorAll(INTERACTIVE).forEach(el => {
        el.removeEventListener('mouseenter', onMove);
        el.addEventListener('mouseenter', onMove);
      });
    };
    addHover();
    const obs = new MutationObserver(addHover);
    obs.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseenter', onDocEnter);
      document.removeEventListener('mouseleave', onDocLeave);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf.current);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      obs.disconnect();
      document.body.classList.remove('has-custom-cursor');
      if (magnetTarget.current) {
        magnetTarget.current.style.transform = '';
      }
    };
  }, []);

  return (
    <div ref={systemRef} className="cc-system">
      <div ref={dotRef} className="cc-dot" />
      <div ref={bracketRefs[0]} className="cc-bracket cc-tl" />
      <div ref={bracketRefs[1]} className="cc-bracket cc-tr" />
      <div ref={bracketRefs[2]} className="cc-bracket cc-bl" />
      <div ref={bracketRefs[3]} className="cc-bracket cc-br" />
      <div ref={scanRef} className="cc-scan" />
      <div ref={pulseRef} className="cc-pulse" />
      <div ref={labelRef} className="cc-label" />
      <div ref={scrollIndicatorRef} className="cc-scroll-indicator" />
    </div>
  );
}
