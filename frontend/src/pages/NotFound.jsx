import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';

export default function NotFound() {
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <div className="notfound-icon">
          <FaExclamationTriangle />
        </div>
        <h1 className="notfound-title">404</h1>
        <h2 className="notfound-subtitle">Oops! Universe Not Found</h2>
        <p className="notfound-text">
          The page you are looking for doesn't exist or has been moved to another dimension.
        </p>
        <Link to="/" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '2rem' }}>
          <FaHome /> Back to Home
        </Link>
      </div>
    </div>
  );
}
