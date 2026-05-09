import React, { useEffect, useState } from 'react';
import './Preloader.css';

const Preloader = ({ loading }) => {
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
      <div className="loader-geometry">
        <div className="loader-circle"></div>
        <div className="loader-circle"></div>
        <div className="loader-circle"></div>
      </div>
      <div className="loader-text">Loading Universe</div>
    </div>
  );
};

export default Preloader;
