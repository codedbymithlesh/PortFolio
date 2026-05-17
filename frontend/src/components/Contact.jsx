import React, { useState } from 'react';
import { FaEnvelope, FaMapMarkerAlt, FaGithub, FaLinkedin, FaYoutube, FaPaperPlane, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { usePortfolio } from '../context/PortfolioContext';

const Contact = React.memo(() => {
  const { portfolio, API } = usePortfolio();
  const { contact } = portfolio;
  
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ loading: false, type: '', message: '' });

  const handleSubmit = React.useCallback(async (e) => {
    e.preventDefault();
    setStatus({ loading: true, type: '', message: '' });
    try {
      const res = await fetch(`${API}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ loading: false, type: 'success', message: 'Message sent successfully!' });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus({ loading: false, type: 'error', message: data.message || 'Failed to send message.' });
      }
    } catch {
      setStatus({ loading: false, type: 'error', message: 'Network error. Please try again later.' });
    }
    setTimeout(() => setStatus({ loading: false, type: '', message: '' }), 5000);
  }, [API, formData]);

  return (
    <section id="contact" className="contact-section mt-5">
      <h2 className="section-title">Initialize Connection</h2>

      <div className="contact-grid">
        <div className="contact-info">
          <div className="card info-card mb-3">
            <FaEnvelope className="info-icon text-cyan" />
            <div>
              <span className="info-label">Email Me</span>
              <p className="info-value">{contact.email}</p>
            </div>
          </div>

          <div className="card info-card mb-4">
            <FaMapMarkerAlt className="info-icon text-cyan" />
            <div>
              <span className="info-label">Location</span>
              <p className="info-value">{contact.location}</p>
            </div>
          </div>

          <div className="contact-socials">
            <a href={contact.github || '#'} className="social-pill" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
            <a href={contact.linkedin || '#'} className="social-pill" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
            <a href={contact.youtube || '#'} className="social-pill" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
          </div>
        </div>

        <div className="card terminal-card">
          <div className="terminal-header">
            <div className="terminal-dots">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
            </div>
            <span className="terminal-title">~/initiate_connection.sh</span>
          </div>
          <div className="terminal-body">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group terminal-input-group">
                <span className="prompt">$&gt;</span>
                <input type="text" placeholder="Enter Full Name..." className="form-input terminal-input" required 
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="form-group terminal-input-group">
                <span className="prompt">$&gt;</span>
                <input type="email" placeholder="Enter Email Address..." className="form-input terminal-input" required 
                  value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="form-group terminal-input-group align-top">
                <span className="prompt">$&gt;</span>
                <textarea 
                  placeholder="How can I help you?..." 
                  className="form-input terminal-input form-textarea" 
                  required
                  rows={4}
                  value={formData.message} 
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </div>
              <button type="submit" className="btn-primary w-100 flex-center terminal-btn" disabled={status.loading}>
                {status.loading ? 'Executing...' : <>[ Execute ] <FaPaperPlane className="ml-2" /></>}
              </button>
              {status.message && (
                <div className={`mt-3 p-2 rounded flex-center ${status.type === 'success' ? 'text-success' : 'text-danger'}`} style={{gap: '8px', color: status.type === 'success' ? '#10b981' : '#ef4444', fontFamily: 'monospace'}}>
                  {status.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />} {status.message}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
});

export default Contact;
