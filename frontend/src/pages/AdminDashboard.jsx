import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUser, FaInfoCircle, FaGraduationCap, FaTools, 
  FaBriefcase, FaEnvelope, FaLock, FaBolt, 
  FaEye, FaSignOutAlt, FaPlus, FaTrash, 
  FaSave, FaRegEnvelopeOpen, FaCog, FaHourglassHalf, FaCheck, FaTimes, FaBars
} from 'react-icons/fa';
import { usePortfolio } from '../context/PortfolioContext';

const TABS = ['Hero', 'About', 'Education', 'Skills', 'Projects', 'Contact', 'Messages', 'Settings'];
const TAB_ICONS = [
  <FaUser />, <FaInfoCircle />, <FaGraduationCap />, <FaTools />, 
  <FaBriefcase />, <FaEnvelope />, <FaRegEnvelopeOpen />, <FaCog />
];

/* ── Tiny reusable field ── */
const Field = ({ label, value, onChange, textarea, type = 'text' }) => (
  <div className="adm-field">
    <label className="adm-label">{label}</label>
    {textarea
      ? <textarea className="adm-input adm-textarea" value={value} onChange={(e) => onChange(e.target.value)} rows={4} />
      : <input type={type} className="adm-input" value={value} onChange={(e) => onChange(e.target.value)} />}
  </div>
);

/* ── Save button with feedback ── */
const SaveBtn = ({ onClick, status }) => (
  <button className={`adm-save-btn ${status}`} onClick={onClick}>
    {status === 'saving' ? <><FaHourglassHalf style={{marginRight: '6px'}} /> Saving...</> : status === 'ok' ? <><FaCheck style={{marginRight: '6px'}} /> Saved!</> : status === 'err' ? <><FaTimes style={{marginRight: '6px'}} /> Error</> : <><FaSave style={{marginRight: '6px'}} /> Save Changes</>}
  </button>
);

function useSave(section, value, updatePortfolio, setGlobalSave) {
  const [status, setStatus] = useState('');
  
  const save = async () => {
    setStatus('saving');
    const ok = await updatePortfolio(section, value);
    setStatus(ok ? 'ok' : 'err');
    setTimeout(() => setStatus(''), 2500);
    return ok;
  };

  useEffect(() => {
    setGlobalSave(() => save, status);
  }, [value, status]);

  return [status, save];
}

/* ══════════════════════ TAB PANELS ══════════════════════ */

function HeroTab({ portfolio, updatePortfolio, setGlobalSave }) {
  const [hero, setHero] = useState({ ...portfolio.hero });
  const [status, save] = useSave('hero', hero, updatePortfolio, setGlobalSave);
  const [uploadStatus, setUploadStatus] = useState('');
  const set = (k) => (v) => setHero((h) => ({ ...h, [k]: v }));

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadStatus('uploading');
    const formData = new FormData();
    formData.append('image', file);
    try {
      const token = localStorage.getItem('admin_token');
      const baseUrl = 'https://port-folio-backend-file.vercel.app';
      const res = await fetch(`${baseUrl}/api/upload/profile`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setHero((h) => ({ ...h, profileImage: data.url }));
        setUploadStatus('done');
      } else {
        setUploadStatus('error');
      }
    } catch {
      setUploadStatus('error');
    }
    setTimeout(() => setUploadStatus(''), 3000);
  };

  return (
    <div className="adm-tab-panel">
      <div className="adm-panel-header">
        <h3 className="adm-panel-title"><FaUser style={{marginRight: '10px'}} /> Hero Section</h3>
      </div>
      <div className="adm-grid-2">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
          <Field label="Full Name" value={hero.name} onChange={set('name')} />
          <Field label="Subtitle / Role" value={hero.subtitle} onChange={set('subtitle')} />
          <Field label="Bio" value={hero.bio} onChange={set('bio')} textarea />
        </div>

        {/* Profile Picture Upload */}
        <div className="adm-field">
          <label className="adm-label">Profile Picture</label>
          <div className="adm-upload-box" style={{ height: '100%', justifyContent: 'center' }}>
            {hero.profileImage && (
              <div className="adm-upload-preview" style={{ width: '120px', height: '120px' }}>
                <img src={hero.profileImage} alt="profile preview" />
              </div>
            )}
            <label className="adm-upload-btn" htmlFor="profile-upload">
              {uploadStatus === 'uploading' ? <><FaHourglassHalf style={{marginRight: '6px'}} /> Uploading...</> : uploadStatus === 'done' ? <><FaCheck style={{marginRight: '6px'}} /> Uploaded!</> : uploadStatus === 'error' ? <><FaTimes style={{marginRight: '6px'}} /> Failed</> : <><FaPlus style={{marginRight: '6px'}} /> Choose Image File</>}
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
            </label>
            <span className="adm-upload-hint">JPG, PNG, WebP — max 5MB</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AboutTab({ portfolio, updatePortfolio, setGlobalSave }) {
  const [about, setAbout] = useState({ ...portfolio.about, badges: [...(portfolio.about.badges || [])] });
  const [status, save] = useSave('about', about, updatePortfolio, setGlobalSave);
  const set = (k) => (v) => setAbout((a) => ({ ...a, [k]: v }));

  const updateBadge = (i, field, val) => {
    const badges = [...about.badges];
    badges[i] = { ...badges[i], [field]: val };
    setAbout((a) => ({ ...a, badges }));
  };
  const scrollRef = useRef(null);
  const addBadge = () => {
    setAbout((a) => ({ ...a, badges: [...a.badges, { label: 'New Badge', type: 'orange' }] }));
    setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 100);
  };
  const removeBadge = (i) => {
    if (!window.confirm('Are you sure you want to delete this badge?')) return;
    setAbout((a) => ({ ...a, badges: a.badges.filter((_, idx) => idx !== i) }));
  };

  return (
    <div className="adm-tab-panel">
      <div className="adm-panel-header">
        <h3 className="adm-panel-title"><FaInfoCircle style={{marginRight: '10px'}} /> About / Universe</h3>
      </div>
      <div className="adm-grid-2">
        <Field label="Professional Summary" value={about.professionalSummary} onChange={set('professionalSummary')} textarea />
        <Field label="Goal Quote" value={about.quote} onChange={set('quote')} textarea />
      </div>
      <div className="adm-section-sub">
        <div className="adm-sub-header">
          <span>Badges</span>
          <button className="adm-add-btn" onClick={addBadge}>+ Add Badge</button>
        </div>
        <div className="adm-pills-edit" ref={scrollRef}>
          {(about.badges || []).map((b, i) => (
            <div key={i} className="adm-array-row">
              <input className="adm-input" value={b.label} onChange={(e) => updateBadge(i, 'label', e.target.value)} placeholder="Badge label" />
              <select className="adm-select" value={b.type} onChange={(e) => updateBadge(i, 'type', e.target.value)}>
                <option value="orange">Gold</option>
                <option value="red">Red</option>
              </select>
              <button className="adm-del-btn" onClick={() => removeBadge(i)}>✕</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EducationTab({ portfolio, updatePortfolio, setGlobalSave }) {
  const [edu, setEdu] = useState(portfolio.education.map((e) => ({ ...e })));
  const [status, save] = useSave('education', edu, updatePortfolio, setGlobalSave);

  const update = (i, field, val) => {
    const next = [...edu];
    next[i] = { ...next[i], [field]: val };
    setEdu(next);
  };
  const scrollRef = useRef(null);
  const add = () => {
    setEdu((e) => [...e, { year: '', title: '', description: '', dotColor: 'blue' }]);
    setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 100);
  };
  const remove = (i) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;
    setEdu((e) => e.filter((_, idx) => idx !== i));
  };

  return (
    <div className="adm-tab-panel" ref={scrollRef}>
      <div className="adm-panel-header">
        <h3 className="adm-panel-title"><FaGraduationCap style={{marginRight: '10px'}} /> Education & Certs</h3>
      </div>
      <button className="adm-add-btn adm-add-block" onClick={add}>+ Add Entry</button>
      <div className="adm-grid-2" style={{ alignItems: 'start' }}>
        {edu.map((item, i) => (
          <div key={i} className="adm-card-row">
            <div className="adm-card-row-header">
              <span className="adm-card-row-num">#{i + 1}</span>
              <button className="adm-del-btn" onClick={() => remove(i)}>✕ Remove</button>
            </div>
            <div className="adm-grid-2">
              <Field label="Year / Date" value={item.year} onChange={(v) => update(i, 'year', v)} />
              <div className="adm-field">
                <label className="adm-label">Dot Color</label>
                <select className="adm-select" value={item.dotColor} onChange={(e) => update(i, 'dotColor', e.target.value)}>
                  <option value="orange">Gold</option>
                  <option value="blue">Red-Light</option>
                  <option value="red">Red</option>
                  <option value="cyan">Gold-Light</option>
                </select>
              </div>
            </div>
            <Field label="Title" value={item.title} onChange={(v) => update(i, 'title', v)} />
            <Field label="Description" value={item.description} onChange={(v) => update(i, 'description', v)} textarea />
          </div>
        ))}
      </div>
      <button className="adm-add-btn adm-add-block" onClick={add}>+ Add Entry</button>
    </div>
  );
}

function SkillsTab({ portfolio, updatePortfolio, setGlobalSave }) {
  const [skills, setSkills] = useState({
    frontend: [...(portfolio.skills.frontend || [])],
    backend: [...(portfolio.skills.backend || [])],
    tools: [...(portfolio.skills.tools || [])],
  });
  const [status, save] = useSave('skills', skills, updatePortfolio, setGlobalSave);

  const SkillList = ({ category, label }) => {
    const list = skills[category];
    const update = (i, v) => setSkills((s) => { const next = [...s[category]]; next[i] = v; return { ...s, [category]: next }; });
    const scrollRef = useRef(null);
    const add = () => {
      setSkills((s) => ({ ...s, [category]: [...s[category], ''] }));
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 100);
    };
    const remove = (i) => {
      if (!window.confirm('Are you sure you want to delete this skill?')) return;
      setSkills((s) => ({ ...s, [category]: s[category].filter((_, idx) => idx !== i) }));
    };

    return (
      <div className="adm-section-sub">
        <div className="adm-sub-header">
          <span>{label}</span>
          <button className="adm-add-btn" onClick={add}>+ Add</button>
        </div>
        <div className="adm-pills-edit" ref={scrollRef}>
          {list.map((s, i) => (
            <div key={i} className="adm-pill-row">
              <input className="adm-input" value={s} onChange={(e) => update(i, e.target.value)} />
              <button className="adm-del-btn" onClick={() => remove(i)}>✕</button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="adm-tab-panel">
      <div className="adm-panel-header">
        <h3 className="adm-panel-title"><FaTools style={{marginRight: '10px'}} /> Tech Arsenal / Skills</h3>
      </div>
      <div className="adm-grid-2" style={{ alignItems: 'start' }}>
        <SkillList category="frontend" label="Frontend" />
        <SkillList category="backend" label="Backend & DB" />
        <SkillList category="tools" label="Tools & Design" />
      </div>
    </div>
  );
}

function ProjectsTab({ portfolio, updatePortfolio, setGlobalSave }) {
  const [projects, setProjects] = useState(portfolio.projects.map((p) => ({ ...p, tech: [...(p.tech || [])] })));
  const [status, save] = useSave('projects', projects, updatePortfolio, setGlobalSave);

  const update = (i, field, val) => {
    const next = [...projects];
    next[i] = { ...next[i], [field]: val };
    setProjects(next);
  };
  const updateTech = (pi, ti, val) => {
    const next = [...projects];
    const tech = [...next[pi].tech];
    tech[ti] = val;
    next[pi] = { ...next[pi], tech };
    setProjects(next);
  };
  const addTech = (pi) => {
    const next = [...projects];
    next[pi] = { ...next[pi], tech: [...next[pi].tech, ''] };
    setProjects(next);
  };
  const removeTech = (pi, ti) => {
    if (!window.confirm('Are you sure you want to delete this tech?')) return;
    const next = [...projects];
    next[pi] = { ...next[pi], tech: next[pi].tech.filter((_, idx) => idx !== ti) };
    setProjects(next);
  };
  const scrollRef = useRef(null);
  const add = () => {
    setProjects((p) => [...p, { title: '', tech: [], description: '', link: '#', linkLabel: 'View Page' }]);
    setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 100);
  };
  const remove = (i) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    setProjects((p) => p.filter((_, idx) => idx !== i));
  };

  return (
    <div className="adm-tab-panel" ref={scrollRef}>
      <div className="adm-panel-header">
        <h3 className="adm-panel-title"><FaBriefcase style={{marginRight: '10px'}} /> Featured Projects</h3>
      </div>
      <button className="adm-add-btn adm-add-block" onClick={add}>+ Add Project</button>
      <div className="adm-grid-2" style={{ alignItems: 'start' }}>
        {projects.map((proj, i) => (
          <div key={i} className="adm-card-row">
            <div className="adm-card-row-header">
              <span className="adm-card-row-num">Project #{i + 1}</span>
              <button className="adm-del-btn" onClick={() => remove(i)}>✕ Remove</button>
            </div>
            <Field label="Link Label" value={proj.linkLabel} onChange={(v) => update(i, 'linkLabel', v)} />
            <Field label="Project Title" value={proj.title} onChange={(v) => update(i, 'title', v)} />
            <Field label="Project URL" value={proj.link} onChange={(v) => update(i, 'link', v)} />
            <Field label="Description" value={proj.description} onChange={(v) => update(i, 'description', v)} textarea />
            <div className="adm-section-sub">
              <div className="adm-sub-header">
                <span>Tech Stack</span>
                <button className="adm-add-btn" onClick={() => addTech(i)}>+ Add</button>
              </div>
              <div className="adm-pills-edit">
                {(proj.tech || []).map((t, j) => (
                  <div key={j} className="adm-pill-row">
                    <input className="adm-input" value={t} onChange={(e) => updateTech(i, j, e.target.value)} />
                    <button className="adm-del-btn" onClick={() => removeTech(i, j)}>✕</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="adm-add-btn adm-add-block" onClick={add}>+ Add Project</button>
    </div>
  );
}

function ContactTab({ portfolio, updatePortfolio, setGlobalSave }) {
  const [contact, setContact] = useState({ ...portfolio.contact });
  const [status, save] = useSave('contact', contact, updatePortfolio, setGlobalSave);
  const set = (k) => (v) => setContact((c) => ({ ...c, [k]: v }));

  return (
    <div className="adm-tab-panel">
      <div className="adm-panel-header">
        <h3 className="adm-panel-title"><FaEnvelope style={{marginRight: '10px'}} /> Contact Info</h3>
      </div>
      <div className="adm-grid-2">
        <Field label="Email Address" value={contact.email} onChange={set('email')} type="email" />
        <Field label="Location" value={contact.location} onChange={set('location')} />
        <Field label="GitHub URL" value={contact.github} onChange={set('github')} />
        <Field label="LinkedIn URL" value={contact.linkedin} onChange={set('linkedin')} />
        <Field label="YouTube URL" value={contact.youtube} onChange={set('youtube')} />
      </div>
    </div>
  );
}

function MessagesTab() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const baseUrl = 'https://port-folio-backend-file.vercel.app';
    try {
      const res = await fetch(`${baseUrl}/api/messages`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
      });
      if (res.ok) setMessages(await res.json());
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    const baseUrl = 'https://port-folio-backend-file.vercel.app';
    await fetch(`${baseUrl}/api/messages/${id}/read`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
    });
    setMessages(messages.map(m => m._id === id ? { ...m, read: true } : m));
  };

  const deleteMsg = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    const baseUrl = 'https://port-folio-backend-file.vercel.app';
    await fetch(`${baseUrl}/api/messages/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
    });
    setMessages(messages.filter(m => m._id !== id));
  };

  if (loading) return <div>Loading messages...</div>;

  return (
    <div className="adm-tab-panel">
      <div className="adm-panel-header">
        <h3 className="adm-panel-title"><FaRegEnvelopeOpen style={{marginRight: '10px'}} /> Messages</h3>
        <button className="adm-upload-btn" onClick={fetchMessages}><FaPlus style={{marginRight: '6px'}} /> Refresh</button>
      </div>
      {messages.length === 0 ? (
        <p style={{ color: '#6B6880' }}>No messages yet.</p>
      ) : (
        <div className="adm-grid-2" style={{ alignItems: 'start' }}>
          {messages.map(m => (
            <div key={m._id} className="adm-card-row" style={{ opacity: m.read ? 0.6 : 1, transition: 'opacity 0.2s' }}>
              <div className="adm-card-row-header">
                <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: m.read ? '#9ca3af' : '#fff' }}>{m.name}</span>
                <span style={{ fontSize: '0.8rem', color: '#6B6880' }}>{new Date(m.createdAt).toLocaleString()}</span>
              </div>
              <div style={{ color: '#f87171', fontSize: '0.9rem' }}>{m.email}</div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', marginTop: '0.5rem', whiteSpace: 'pre-wrap' }}>
                {m.message}
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                {!m.read && <button className="adm-add-btn" onClick={() => markRead(m._id)}><FaCheck style={{marginRight: '6px'}} /> Mark Read</button>}
                <button className="adm-del-btn" onClick={() => deleteMsg(m._id)}><FaTrash style={{marginRight: '6px'}} /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SettingsTab() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState({ loading: false, msg: '', type: '' });

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, msg: '', type: '' });
    const baseUrl = 'https://port-folio-backend-file.vercel.app';
    try {
      const res = await fetch(`${baseUrl}/api/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ loading: false, msg: 'Password changed successfully', type: 'success' });
        setCurrentPassword('');
        setNewPassword('');
      } else {
        setStatus({ loading: false, msg: data.message, type: 'error' });
      }
    } catch {
      setStatus({ loading: false, msg: 'Network error', type: 'error' });
    }
  };

  return (
    <div className="adm-tab-panel">
      <div className="adm-panel-header">
        <h3 className="adm-panel-title"><FaLock style={{marginRight: '10px'}} /> Security Settings</h3>
      </div>
      <form onSubmit={handleChangePassword} className="adm-card-row">
        <div className="adm-grid-2">
          <Field label="Current Password" type="password" value={currentPassword} onChange={setCurrentPassword} />
          <Field label="New Password (min 8 chars)" type="password" value={newPassword} onChange={setNewPassword} />
        </div>
        <button type="submit" className="adm-save-btn" disabled={status.loading || !currentPassword || newPassword.length < 8} style={{ width: 'fit-content' }}>
          {status.loading ? 'Updating...' : 'Update Password'}
        </button>
        {status.msg && (
          <div style={{ color: status.type === 'error' ? '#ef4444' : '#10b981', marginTop: '0.5rem', fontWeight: 'bold' }}>
            {status.msg}
          </div>
        )}
      </form>
    </div>
  );
}

/* ══════════════════════ DASHBOARD ══════════════════════ */

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const { portfolio, loading, updatePortfolio } = usePortfolio();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Global Save State
  const [globalSaveFunc, setGlobalSaveFunc] = useState(null);
  const [globalSaveStatus, setGlobalSaveStatus] = useState('');

  const setGlobalSave = (func, status) => {
    setGlobalSaveFunc(() => func);
    setGlobalSaveStatus(status);
  };

  // Refresh confirmation
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      // If we are in a tab that has a save function, warn the user
      if (activeTab < 6) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [activeTab]);

  useEffect(() => {
    document.title = 'Admin Dashboard | Portfolio Control';
    const token = localStorage.getItem('admin_token');
    if (!token) navigate('/admin/login');
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="adm-loading">
        <div className="adm-spinner-big"></div>
        <p>Loading portfolio data...</p>
      </div>
    );
  }

  const panels = [
    <HeroTab portfolio={portfolio} updatePortfolio={updatePortfolio} setGlobalSave={setGlobalSave} />,
    <AboutTab portfolio={portfolio} updatePortfolio={updatePortfolio} setGlobalSave={setGlobalSave} />,
    <EducationTab portfolio={portfolio} updatePortfolio={updatePortfolio} setGlobalSave={setGlobalSave} />,
    <SkillsTab portfolio={portfolio} updatePortfolio={updatePortfolio} setGlobalSave={setGlobalSave} />,
    <ProjectsTab portfolio={portfolio} updatePortfolio={updatePortfolio} setGlobalSave={setGlobalSave} />,
    <ContactTab portfolio={portfolio} updatePortfolio={updatePortfolio} setGlobalSave={setGlobalSave} />,
    <MessagesTab />,
    <SettingsTab />,
  ];

  const showSaveBtn = activeTab < 6;

  return (
    <div className={`adm-root ${sidebarOpen ? 'sidebar-open' : ''}`}>
      {sidebarOpen && <div className="adm-sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}

      <aside className={`adm-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="adm-sidebar-brand">
          <span className="adm-brand-icon"><FaBolt /></span>
          <div>
            <div className="adm-brand-name">{portfolio.hero.name || 'Portfolio'}</div>
            <div className="adm-brand-sub">Admin Panel</div>
          </div>
          <button className="adm-sidebar-close" onClick={() => setSidebarOpen(false)}><FaTimes /></button>
        </div>

        <nav className="adm-nav">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              className={`adm-nav-item ${activeTab === i ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(i);
                setSidebarOpen(false);
              }}
            >
              <span className="adm-nav-icon">{TAB_ICONS[i]}</span>
              <span>{tab}</span>
            </button>
          ))}
        </nav>

        <div className="adm-sidebar-footer">
          <a href="/" className="adm-view-site" target="_blank" rel="noopener noreferrer"><FaEye style={{marginRight: '6px'}} /> <span>View Site</span></a>
          <button className="adm-logout-btn" onClick={logout}><FaSignOutAlt style={{marginRight: '6px'}} /> <span>Logout</span></button>
        </div>
      </aside>

      <main className="adm-main">
        <div className="adm-main-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
            <button className="adm-hamburger" onClick={() => setSidebarOpen(true)}>
              <FaBars />
            </button>
            <div>
              <h2 className="adm-main-title">{TABS[activeTab]}</h2>
              <p className="adm-main-sub">Manage your portfolio details</p>
            </div>
          </div>
          
          {showSaveBtn && (
            <div className="adm-header-actions">
              <SaveBtn onClick={globalSaveFunc} status={globalSaveStatus} />
            </div>
          )}
        </div>

        <div className="adm-content">
          {panels[activeTab]}
        </div>
      </main>
    </div>
  );
}
