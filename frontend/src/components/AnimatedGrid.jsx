import React, { useMemo } from 'react';
import './AnimatedGrid.css';

const AnimatedGrid = React.memo(() => {
  const horizontalStreaks = useMemo(() => 
    [...Array(window.innerWidth > 768 ? 15 : 6)].map((_, i) => ({
      id: i,
      top: `${(i + 1) * (window.innerWidth > 768 ? 150 : 280)}px`,
      delay: `${Math.random() * 10}s`,
      duration: `${Math.random() * 5 + 10}s`
    })), []);

  const verticalStreaks = useMemo(() => 
    [...Array(window.innerWidth > 768 ? 15 : 6)].map((_, i) => ({
      id: i,
      left: `${(i + 1) * (window.innerWidth > 768 ? 150 : 280)}px`,
      delay: `${Math.random() * 10}s`,
      duration: `${Math.random() * 5 + 10}s`
    })), []);

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
