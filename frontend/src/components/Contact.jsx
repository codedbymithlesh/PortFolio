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

        <div className="card contact-form-card">
          <h3 className="card-title">Send a Message</h3>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input type="text" placeholder="Full Name" className="form-input" required 
                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="form-group">
              <input type="email" placeholder="Email Address" className="form-input" required 
                value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="form-group">
              <input 
                type="text"
                placeholder="How can I help you?" 
                className="form-input" 
                required
                value={formData.message} 
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              />
            </div>
            <button type="submit" className="btn-primary w-100 flex-center" disabled={status.loading}>
              {status.loading ? 'Sending...' : <>Send Message <FaPaperPlane className="ml-2" /></>}
            </button>
            {status.message && (
              <div className={`mt-3 p-2 rounded flex-center ${status.type === 'success' ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`} style={{gap: '8px', border: `1px solid ${status.type === 'success' ? '#10b981' : '#ef4444'}`, color: status.type === 'success' ? '#10b981' : '#ef4444'}}>
                {status.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />} {status.message}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
});

export default Contact;
