import React, { useEffect, useRef } from 'react';
import { FaGraduationCap } from 'react-icons/fa';
import { usePortfolio } from '../context/PortfolioContext';
import WaveLayers from './WaveLayers';

const Education = React.memo(() => {
  const { portfolio } = usePortfolio();
  const { education } = portfolio;
  const timelineRef = useRef(null);
  const trackRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startTranslate = useRef(0);
  const maxScrollWidth = useRef(0);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth <= 768 || !timelineRef.current || !trackRef.current) return;
      maxScrollWidth.current = trackRef.current.scrollWidth - timelineRef.current.clientWidth;
    };
    let ticking = false;
    const onScroll = () => {
      if (isDragging.current || window.innerWidth <= 768 || maxScrollWidth.current <= 0) return;
      if (!ticking) {
        requestAnimationFrame(() => {
          const r = timelineRef.current?.getBoundingClientRect();
          if (r && r.top < window.innerHeight && r.bottom > 0) {
            const s = (window.innerHeight - r.top) - 150;
            let t = Math.max(0, Math.min(s * 0.55, maxScrollWidth.current));
            trackRef.current.style.transform = `translate3d(${-t}px,0,0)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    const timer = setTimeout(update, 500);
    return () => { clearTimeout(timer); window.removeEventListener('scroll', onScroll); };
  }, [education]);

  const onDown = (e) => {
    if (window.innerWidth <= 768 || e.target.tagName === 'A' || e.target.tagName === 'BUTTON') return;
    isDragging.current = true; startX.current = e.pageX;
    const m = new DOMMatrixReadOnly(window.getComputedStyle(trackRef.current).transform);
    startTranslate.current = m.m41;
    timelineRef.current.style.cursor = 'grabbing';
  };
  const onMove = (e) => {
    if (!isDragging.current) return; e.preventDefault();
    const mx = trackRef.current.scrollWidth - timelineRef.current.clientWidth;
    if (mx > 0) {
      let t = startTranslate.current + (e.pageX - startX.current) * 1.5;
      t = Math.max(-mx, Math.min(0, t));
      trackRef.current.style.transform = `translate3d(${t}px,0,0)`;
    }
  };
  const onUp = () => { if (isDragging.current) { isDragging.current = false; timelineRef.current.style.cursor = 'grab'; } };

  const dotColors = ['green', 'purple', 'blue', 'orange'];

  return (
    <div className="card h-100">
      <div className="section-header mb-3">
        <FaGraduationCap style={{color:'var(--accent-orange)', fontSize:'1.1rem'}} />
        <h3 className="card-title m-0" style={{fontSize:'1rem'}}>
          <span className="kw">git</span> <span className="fn">log</span> <span className="cm">// education</span>
        </h3>
      </div>

      <div className="horizontal-timeline" ref={timelineRef}
        onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}>
        <div className="roadmap-track" ref={trackRef}>
          {[...(education || [])].map((item, i) => (
            <div key={i} className="git-entry liquid-wave" style={{flex:'0 0 260px', flexDirection:'column', gap:'0.5rem'}}>
              <WaveLayers />
              <div style={{display:'flex', alignItems:'flex-start', gap:'0.8rem'}}>
                <div className="git-graph">
                  <div className={`git-dot ${dotColors[i % dotColors.length]}`}></div>
                  <div className="git-line"></div>
                </div>
                <div className="git-info">
                  <div className="git-hash">{item.year}</div>
                  <div className="git-message">{item.title}</div>
                  <div className="git-desc">{item.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default Education;
