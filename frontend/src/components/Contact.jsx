import React, { useState } from 'react';
import { FaEnvelope, FaMapMarkerAlt, FaGithub, FaLinkedin, FaYoutube, FaPaperPlane, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { usePortfolio } from '../context/PortfolioContext';
import WaveLayers from './WaveLayers';

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
    <section id="contact" className="contact-section">
      <div className="section-label">contact.init</div>
      <h2 className="section-title">Get In Touch</h2>
      <p className="section-subtitle">Have a project in mind? Let's talk.</p>

      <div className="contact-grid">
        <div className="contact-info">
          <div className="card info-card liquid-wave">
            <WaveLayers />
            <FaEnvelope className="info-icon" />
            <div>
              <span className="info-label">email</span>
              <p className="info-value">{contact.email}</p>
            </div>
          </div>
          <div className="card info-card liquid-wave" style={{marginTop:'0.5rem'}}>
            <WaveLayers />
            <FaMapMarkerAlt className="info-icon" />
            <div>
              <span className="info-label">location</span>
              <p className="info-value">{contact.location}</p>
            </div>
          </div>
          <div className="contact-socials" style={{marginTop:'0.6rem'}}>
            <a href={contact.github || '#'} className="social-pill" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
            <a href={contact.linkedin || '#'} className="social-pill" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
            <a href={contact.youtube || '#'} className="social-pill" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
          </div>
        </div>

        <div className="terminal-window liquid-wave">
          <WaveLayers />
          <div className="terminal-bar">
            <div className="terminal-dots">
              <span className="dot r"></span>
              <span className="dot y"></span>
              <span className="dot g"></span>
            </div>
            <div className="terminal-tab">
              <span className="caret">&gt;</span>
              <span>bash — contact</span>
            </div>
          </div>
          <div className="terminal-body">
            <div className="terminal-line">
              <span className="prompt-char">$</span> <span className="cmd">./send_message.sh</span>
            </div>
            <div className="terminal-line" style={{marginBottom:'0.6rem'}}>
              <span className="output">{'// fill in the fields below'}</span>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <span className="label">name:</span>
                <input type="text" className="terminal-input" placeholder="your name" required
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="form-row">
                <span className="label">email:</span>
                <input type="email" className="terminal-input" placeholder="you@example.com" required
                  value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="form-row">
                <span className="label" style={{alignSelf:'flex-start', paddingTop:'0.25rem'}}>message:</span>
                <textarea className="terminal-textarea" placeholder="your message..." required
                  value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} />
              </div>
              <button type="submit" className="terminal-submit" disabled={status.loading}>
                {status.loading ? 'sending...' : 'send'}
              </button>
            </form>

            {status.message && (
              <div className="terminal-line" style={{marginTop:'0.6rem'}}>
                {status.type === 'success'
                  ? <span className="success"><FaCheckCircle /> {status.message}</span>
                  : <span style={{color:'#f85149'}}><FaExclamationCircle /> {status.message}</span>
                }
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
});

export default Contact;
