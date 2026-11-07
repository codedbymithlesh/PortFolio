import React, { useEffect, useRef, useState } from 'react';
import {
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaMapMarkerAlt,
  FaYoutube,
} from 'react-icons/fa';
import { usePortfolio } from '../context/PortfolioContext';
import { isUsableExternalUrl } from '../lib/links';
import DecodeText from './DecodeText';

const SOCIALS = [
  { key: 'github', label: 'GitHub', icon: FaGithub },
  { key: 'linkedin', label: 'LinkedIn', icon: FaLinkedin },
  { key: 'youtube', label: 'YouTube', icon: FaYoutube },
];

const INITIAL_FORM = { name: '', email: '', message: '' };
const INITIAL_STATUS = { loading: false, type: '', message: '' };

const Contact = React.memo(() => {
  const { portfolio, API } = usePortfolio();
  const { contact } = portfolio;
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [status, setStatus] = useState(INITIAL_STATUS);
  const statusTimer = useRef(null);

  useEffect(() => () => {
    if (statusTimer.current) clearTimeout(statusTimer.current);
  }, []);

  const updateField = (field) => (event) => {
    setFormData((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (statusTimer.current) clearTimeout(statusTimer.current);
    setStatus({ loading: true, type: '', message: '' });

    try {
      const response = await fetch(`${API}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setStatus({ loading: false, type: 'success', message: 'Message sent successfully.' });
        setFormData(INITIAL_FORM);
      } else {
        setStatus({
          loading: false,
          type: 'error',
          message: data.message || 'The message could not be sent. Please try again.',
        });
      }
    } catch {
      setStatus({
        loading: false,
        type: 'error',
        message: 'Network error. Please try again later.',
      });
    }

    statusTimer.current = setTimeout(() => setStatus(INITIAL_STATUS), 6000);
  };

  const socials = SOCIALS.filter(({ key }) => isUsableExternalUrl(contact[key]));

  return (
    <div className="contact">
      <div className="contact__lead">
        <p
          className="contact__lede"
          data-reveal
          style={{ '--reveal-delay': '40ms' }}
        >
          Have a project in mind, a role to discuss, or a question about the work?
          Use the form to start a conversation.
        </p>

        {contact.email && (
          <a
            className="contact__email"
            href={`mailto:${contact.email}`}
            data-reveal
            style={{ '--reveal-delay': '140ms' }}
          >
            {contact.email}
          </a>
        )}

        <dl
          className="contact__details"
          data-reveal
          style={{ '--reveal-delay': '220ms' }}
        >
          {contact.email && (
            <div>
              <dt><FaEnvelope aria-hidden="true" /> Email</dt>
              <dd><a href={`mailto:${contact.email}`}>{contact.email}</a></dd>
            </div>
          )}

          {contact.location && (
            <div>
              <dt><FaMapMarkerAlt aria-hidden="true" /> Location</dt>
              <dd>{contact.location}</dd>
            </div>
          )}
        </dl>

        {socials.length > 0 && (
          <ul
            className="contact__socials"
            data-reveal
            style={{ '--reveal-delay': '300ms' }}
          >
            {socials.map(({ key, label, icon: Icon }) => (
              <li key={key}>
                <a
                  href={contact[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label} profile`}
                >
                  <Icon aria-hidden="true" />
                  <DecodeText>{label}</DecodeText>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div
        className="contact__form-wrap"
        data-reveal
        style={{ '--reveal-delay': '180ms' }}
      >
        <h3 className="contact__form-title">Send a message</h3>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="contact-name">Name</label>
            <input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              maxLength={100}
              placeholder="Your name"
              required
              value={formData.name}
              onChange={updateField('name')}
            />
          </div>

          <div className="field">
            <label htmlFor="contact-email">Email</label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              maxLength={254}
              placeholder="you@example.com"
              required
              value={formData.email}
              onChange={updateField('email')}
            />
          </div>

          <div className="field">
            <label htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              name="message"
              maxLength={2000}
              placeholder="Tell me about the project, role or question."
              required
              value={formData.message}
              onChange={updateField('message')}
            />
          </div>

          <button
            type="submit"
            className="contact__submit"
            disabled={status.loading}
          >
            <DecodeText>{status.loading ? 'Sending…' : 'Send message'}</DecodeText>
            <span className="contact__submit-arrow" aria-hidden="true">↗</span>
          </button>

          <p
            className={`form-status ${status.type ? `form-status--${status.type}` : ''}`.trim()}
            role={status.type === 'error' ? 'alert' : 'status'}
            aria-live="polite"
          >
            {status.message}
          </p>
        </form>
      </div>
    </div>
  );
});

export default Contact;
