import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBolt, FaEye, FaEyeSlash, FaUnlock, FaArrowLeft } from 'react-icons/fa';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const baseUrl = 'https://port-folio-backend-file.vercel.app';
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('admin_token', data.token);
        navigate('/admin');
      } else if (res.status === 401) {
        setError('❌ Wrong password');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch {
      setError('⚠️ Cannot connect to server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-logo-icon"><FaBolt /></div>
          <h1 className="admin-login-title">Admin Access</h1>
          <p className="admin-login-sub">Portfolio Control Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-form-group">
            <label className="admin-label">Password</label>
            <div className="admin-input-wrapper">
              <input
                type={showPass ? 'text' : 'password'}
                className={`admin-input ${error ? 'admin-input-error' : ''}`}
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                required
              />
              <button
                type="button"
                className="admin-show-pass"
                onClick={() => setShowPass((v) => !v)}
                tabIndex={-1}
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {error && <span className="admin-error-msg">{error}</span>}
          </div>

          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? <span className="admin-spinner"></span> : <><FaUnlock style={{marginRight: '8px'}} /> Enter Dashboard</>}
          </button>
        </form>

        <p className="admin-login-footer">
          <a href="/" className="admin-back-link"><FaArrowLeft style={{marginRight: '6px'}} /> Back to Portfolio</a>
        </p>
      </div>
    </div>
  );
}
