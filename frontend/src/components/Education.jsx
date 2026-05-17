import React, { useEffect, useRef } from 'react';
import { FaGraduationCap } from 'react-icons/fa';
import { usePortfolio } from '../context/PortfolioContext';

const Education = React.memo(() => {
  const { portfolio } = usePortfolio();
  const { education } = portfolio;
  const timelineRef = useRef(null);
  const trackRef = useRef(null);

  // Drag-to-scroll state refs
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startTranslate = useRef(0);

  // High-performance cached layout coordinates
  const cardOffsetTop = useRef(0);
  const cardHeight = useRef(0);
  const maxScrollWidth = useRef(0);

  useEffect(() => {
    // Cache dimensions once on load or resize to prevent layout thrashing inside scroll event
    const updateDimensions = () => {
      if (window.innerWidth <= 768) return;
      if (!timelineRef.current || !trackRef.current) return;

      const rect = timelineRef.current.getBoundingClientRect();
      cardOffsetTop.current = rect.top + window.scrollY;
      cardHeight.current = rect.height;
      maxScrollWidth.current = trackRef.current.scrollWidth - timelineRef.current.clientWidth;
    };

    const handleScroll = () => {
      // Prevent page scroll linking if user is actively dragging the timeline manually
      if (isDragging.current) return;
      if (window.innerWidth <= 768) return;
      if (maxScrollWidth.current <= 0) return;

      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;

      // Check if the card is visible in the viewport using cached coordinates
      const cardTopInViewport = cardOffsetTop.current - scrollTop;
      const cardBottomInViewport = cardTopInViewport + cardHeight.current;

      if (cardTopInViewport < windowHeight && cardBottomInViewport > 0) {
        // Distance the card has traveled up into the viewport since entering the bottom
        // 180px trigger offset keeps translation at 0 until fully in readable viewport area
        const triggerOffset = 180;
        const scrolledDistance = (windowHeight - cardTopInViewport) - triggerOffset;
        
        // scrollFactor of 0.55 is smooth, premium, and extremely easy to read
        const scrollFactor = 0.55;
        let scrollTarget = scrolledDistance * scrollFactor;
        
        // Clamp target scroll between 0 and maxScrollWidth
        if (scrollTarget < 0) scrollTarget = 0;
        if (scrollTarget > maxScrollWidth.current) scrollTarget = maxScrollWidth.current;
        
        // Apply hardware-accelerated translate3d directly
        trackRef.current.style.transform = `translate3d(${-scrollTarget}px, 0, 0)`;
      }
    };

    updateDimensions();
    handleScroll();

    window.addEventListener('resize', () => { updateDimensions(); handleScroll(); }, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial delay to ensure page rendering settles before measuring
    const timer = setTimeout(() => {
      updateDimensions();
      handleScroll();
    }, 500);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [education]);

  // Mouse Drag-to-Scroll Event Handlers
  const handleMouseDown = (e) => {
    if (window.innerWidth <= 768) return;
    if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') return;

    isDragging.current = true;
    startX.current = e.pageX;

    if (trackRef.current) {
      const style = window.getComputedStyle(trackRef.current);
      const matrix = new DOMMatrixReadOnly(style.transform);
      startTranslate.current = matrix.m41; // Cache current X coordinate translation
      timelineRef.current.style.cursor = 'grabbing';
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();

    if (!trackRef.current || !timelineRef.current) return;

    const maxScroll = trackRef.current.scrollWidth - timelineRef.current.clientWidth;
    if (maxScroll > 0) {
      const x = e.pageX;
      const walk = (x - startX.current) * 1.5; // Controls dragging slide speed multiplier
      
      let targetTranslate = startTranslate.current + walk;
      
      // Clamp translations to horizontal limits
      if (targetTranslate > 0) targetTranslate = 0;
      if (targetTranslate < -maxScroll) targetTranslate = -maxScroll;
      
      trackRef.current.style.transform = `translate3d(${targetTranslate}px, 0, 0)`;
    }
  };

  const handleMouseUpOrLeave = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (timelineRef.current) {
      timelineRef.current.style.cursor = 'grab';
    }
  };

  return (
    <div className="card h-100 education-bento-card">
      <div className="section-header mb-4">
        <FaGraduationCap className="header-icon text-cyan" />
        <h3 className="card-title m-0">Educational Roadmap</h3>
      </div>

      <div 
        className="horizontal-timeline" 
        ref={timelineRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
      >
        <div className="roadmap-track" ref={trackRef}>
          {[...(education || [])].map((item, i) => (
            <div key={i} className="roadmap-item">
              <div className="roadmap-point">
                <div className={`timeline-dot ${item.dotColor || 'blue'}`}></div>
                <div className="roadmap-line"></div>
              </div>
              <div className="roadmap-content">
                <span className={`timeline-date ${item.dotColor || 'blue'}-text`}>{item.year}</span>
                <h4 className="timeline-title-small">{item.title}</h4>
                <p className="timeline-desc-small">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default Education;
