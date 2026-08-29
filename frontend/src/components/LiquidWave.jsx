import React from 'react';

export default function LiquidWave({ children, className = '' }) {
  return (
    <div className={`liquid-wave ${className}`}>
      <div className="lw-wave">
        <div className="lw-wave-1" />
        <div className="lw-wave-2" />
        <div className="lw-wave-3" />
      </div>
      {children}
    </div>
  );
}
