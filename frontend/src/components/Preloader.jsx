import React, { useEffect, useState } from 'react';
import './Preloader.css';

const Preloader = React.memo(({ loading }) => {
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!loading) {
      setFadeOut(true);
      const timer = setTimeout(() => setShow(false), 500); // match transition duration
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (!show) return null;

  return (
    <div className={`preloader-container ${fadeOut ? 'fade-out' : ''}`}>
      <div className="loader-content">
        <div className="loader-ring"></div>
        <div className="loader-logo">MR</div>
      </div>
      <div className="loader-status">Loading...</div>
    </div>
  );
});

export default Preloader;
