import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBolt, FaEye, FaEyeSlash, FaUnlock, FaArrowLeft, FaEnvelope, FaShieldAlt, FaHashtag } from 'react-icons/fa';

export default function AdminLogin() {
  const [mode, setMode] = useState('login'); // 'login' or 'recover'
  const [recoveryStep, setRecoveryStep] = useState(1); // 1: Request, 2: Verify
  const [password, setPassword] = useState('');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const baseUrl = 'https://port-folio-backend-file.vercel.app';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'login') {
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
          setError('Wrong password');
        } else {
          setError(data.message || 'Login failed');
        }
      } else {
        // Recovery Mode
        if (recoveryStep === 1) {
          // Request OTP
          const res = await fetch(`${baseUrl}/api/auth/request-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: recoveryEmail }),
          });
          const data = await res.json();
          if (res.ok) {
            setSuccess(data.message);
            setRecoveryStep(2);
          } else {
            const detail = data.error ? `: ${data.error}` : '';
            setError((data.message || 'Failed to send OTP') + detail);
          }
        } else {
          // Verify OTP & Reset
          const res = await fetch(`${baseUrl}/api/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: recoveryEmail, otp, newPassword }),
          });
          const data = await res.json();
          if (res.ok) {
            setSuccess(data.message);
            setMode('login');
            setRecoveryStep(1);
            setRecoveryEmail('');
            setOtp('');
            setNewPassword('');
          } else {
            setError(data.message || 'Verification failed');
          }
        }
      }
    } catch {
      setError('Cannot connect to server. Check your internet or backend status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-logo-icon">
            {mode === 'login' ? <FaBolt /> : <FaShieldAlt />}
          </div>
          <h1 className="admin-login-title">
            {mode === 'login' ? 'Admin Access' : recoveryStep === 1 ? 'Identity Verification' : 'Verify OTP'}
          </h1>
          <p className="admin-login-sub">
            {mode === 'login' ? 'Portfolio Control Panel' : recoveryStep === 1 ? 'Enter your registered email' : 'Step 2: Enter the code sent to your email'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          {success && <div className="admin-success-msg" style={{color: '#10b981', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem'}}>{success}</div>}
          
          {mode === 'login' ? (
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
                >
                  {showPass ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          ) : recoveryStep === 1 ? (
            <div className="admin-form-group">
              <label className="admin-label">Recovery Email</label>
              <div className="admin-input-wrapper">
                <input
                  type="email"
                  className="admin-input"
                  placeholder="Enter registered email"
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  required
                />
                <div className="admin-show-pass" style={{pointerEvents: 'none'}}><FaEnvelope /></div>
              </div>
            </div>
          ) : (
            <>
              <div className="admin-form-group">
                <label className="admin-label">Enter 6-Digit OTP</label>
                <div className="admin-input-wrapper">
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="Check your email"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength="6"
                  />
                  <div className="admin-show-pass" style={{pointerEvents: 'none'}}><FaHashtag /></div>
                </div>
              </div>
              <div className="admin-form-group" style={{marginTop: '1rem'}}>
                <label className="admin-label">New Password</label>
                <div className="admin-input-wrapper">
                  <input
                    type={showPass ? 'text' : 'password'}
                    className="admin-input"
                    placeholder="Min 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="admin-show-pass"
                    onClick={() => setShowPass((v) => !v)}
                    tabIndex={-1}
                  >
                    {showPass ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </>
          )}

          {error && <div className="admin-error-msg" style={{marginTop: mode === 'recover' ? '1rem' : '0'}}>{error}</div>}

          <button type="submit" className="admin-login-btn" disabled={loading} style={{marginTop: '1.5rem'}}>
            {loading ? <span className="admin-spinner"></span> : (
              mode === 'login' ? <><FaUnlock style={{marginRight: '8px'}} /> Enter Dashboard</> : 
              recoveryStep === 1 ? 'Send OTP' : 'Verify & Reset'
            )}
          </button>
        </form>

        <div className="admin-login-footer" style={{display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center'}}>
          <button 
            type="button" 
            className="admin-forgot-btn" 
            style={{background: 'none', border: 'none', color: '#6B6880', fontSize: '0.9rem', cursor: 'pointer', textDecoration: 'underline'}}
            onClick={() => {
              if (mode === 'recover' && recoveryStep === 2) {
                setRecoveryStep(1);
              } else {
                setMode(mode === 'login' ? 'recover' : 'login');
                setRecoveryStep(1);
              }
              setError('');
              setSuccess('');
            }}
          >
            {mode === 'login' ? 'Forgot Password?' : 'Back'}
          </button>
          <a href="/" className="admin-back-link">
            <FaArrowLeft style={{marginRight: '6px'}} /> Back to Portfolio
          </a>
        </div>
      </div>
    </div>
  );
}
