import React, { useMemo } from 'react';
import './AnimatedGrid.css';

const AnimatedGrid = React.memo(() => {
  const horizontalStreaks = useMemo(() => {
    const isDesktop = window.innerWidth > 768;
    const count = isDesktop ? 18 : 8;
    const gridStep = 50;
    const lineJump = isDesktop ? 3 : 6;
    return [...Array(count)].map((_, i) => ({
      id: i,
      top: `${(i * lineJump + 1) * gridStep}px`,
      delay: `${Math.random() * 10}s`,
      duration: `${Math.random() * 5 + 12}s`
    }));
  }, []);

  const verticalStreaks = useMemo(() => {
    const isDesktop = window.innerWidth > 768;
    const count = isDesktop ? 18 : 8;
    const gridStep = 50;
    const lineJump = isDesktop ? 3 : 6;
    return [...Array(count)].map((_, i) => ({
      id: i,
      left: `${(i * lineJump + 1) * gridStep}px`,
      delay: `${Math.random() * 10}s`,
      duration: `${Math.random() * 5 + 12}s`
    }));
  }, []);

  return (
    <div className="animated-grid-container">
      <div className="grid-background">
        {horizontalStreaks.map((streak) => (
          <div 
            key={`h-${streak.id}`} 
            className="grid-streak horizontal"
            style={{
              top: streak.top,
              animationDelay: streak.delay,
              animationDuration: streak.duration
            }}
          ></div>
        ))}
        {verticalStreaks.map((streak) => (
          <div 
            key={`v-${streak.id}`} 
            className="grid-streak vertical"
            style={{
              left: streak.left,
              animationDelay: streak.delay,
              animationDuration: streak.duration
            }}
          ></div>
        ))}
      </div>
      <div className="grid-glow"></div>
    </div>
  );
});

export default AnimatedGrid;
