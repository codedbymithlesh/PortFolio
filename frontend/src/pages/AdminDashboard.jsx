import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  FaUser, FaInfoCircle, FaGraduationCap, FaTools, 
  FaBriefcase, FaEnvelope, FaBolt,
  FaEye, FaSignOutAlt, FaInbox, FaCog, FaTimes
} from 'react-icons/fa';
import { usePortfolio } from '../context/PortfolioContext';

import HeroTab from '../components/admin/HeroTab';
import AboutTab from '../components/admin/AboutTab';
import EducationTab from '../components/admin/EducationTab';
import SkillsTab from '../components/admin/SkillsTab';
import ProjectsTab from '../components/admin/ProjectsTab';
import ContactTab from '../components/admin/ContactTab';
import MessagesTab from '../components/admin/MessagesTab';
import SettingsTab from '../components/admin/SettingsTab';
import { SaveBtn } from '../components/admin/AdminCommon';

const MENU_ITEMS = [
  { name: 'Hero', path: '/admin', icon: <FaUser /> },
  { name: 'About', path: '/admin/about', icon: <FaInfoCircle /> },
  { name: 'Edu', path: '/admin/education', icon: <FaGraduationCap /> },
  { name: 'Skills', path: '/admin/skills', icon: <FaTools /> },
  { name: 'Projects', path: '/admin/projects', icon: <FaBriefcase /> },
  { name: 'Contact', path: '/admin/contact', icon: <FaEnvelope /> },
  { name: 'Messages', path: '/admin/messages', icon: <FaInbox /> },
  { name: 'Settings', path: '/admin/settings', icon: <FaCog /> },
];

const BOTTOM_NAV = [
  { name: 'Home', path: '/admin', icon: <FaUser /> },
  { name: 'About', path: '/admin/about', icon: <FaInfoCircle /> },
  { name: 'Skills', path: '/admin/skills', icon: <FaTools /> },
  { name: 'Projects', path: '/admin/projects', icon: <FaBriefcase /> },
  { name: 'Messages', path: '/admin/messages', icon: <FaInbox /> },
];

export default function AdminDashboard() {
  const { portfolio, loading, updatePortfolio } = usePortfolio();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const saveRef = useRef(null);
  const [globalSaveStatus, setGlobalSaveStatus] = useState('');
  const [globalIsDirty, setGlobalIsDirty] = useState(false);

  const setGlobalSave = useCallback((func, status, isDirty) => {
    saveRef.current = func;
    setGlobalSaveStatus(status);
    setGlobalIsDirty(isDirty);
  }, []);

  const handleGlobalSave = () => {
    if (saveRef.current) saveRef.current();
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (globalIsDirty) { e.preventDefault(); e.returnValue = ''; }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [globalIsDirty]);

  useEffect(() => {
    document.title = 'Admin Dashboard | Portfolio Control';
    const token = localStorage.getItem('admin_token');
    if (!token) navigate('/admin/login');
  }, [navigate]);

  const logout = useCallback(() => {
    if (!window.confirm('Logout? Unsaved changes will be lost.')) return;
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  }, [navigate]);

  useEffect(() => {
    let timeoutId;
    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => logout(), 30 * 60 * 1000);
    };
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(e => window.addEventListener(e, resetTimer));
    resetTimer();
    return () => { clearTimeout(timeoutId); events.forEach(e => window.removeEventListener(e, resetTimer)); };
  }, [logout]);

  if (loading) {
    return (
      <div className="adm-loading">
        <div className="adm-spinner-big"></div>
        <p>Loading...</p>
      </div>
    );
  }

  const currentTab = MENU_ITEMS.find(item => item.path === location.pathname) || MENU_ITEMS[0];
  const showSaveBtn = !location.pathname.includes('messages') && !location.pathname.includes('settings');

  return (
    <div className={`adm-root ${sidebarOpen ? 'sidebar-open' : ''}`}>
      {sidebarOpen && <div className="adm-sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Desktop Sidebar */}
      <aside className={`adm-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="adm-sidebar-brand">
          <span className="adm-brand-icon"><FaBolt /></span>
          <div>
            <div className="adm-brand-name">{portfolio.hero.name || 'Portfolio'}</div>
            <div className="adm-brand-sub">admin panel</div>
          </div>
          <button className="adm-sidebar-close" onClick={() => setSidebarOpen(false)}><FaTimes /></button>
        </div>

        <nav className="adm-nav">
          {MENU_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`adm-nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="adm-nav-icon">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="adm-sidebar-footer">
          <a href="/" className="adm-view-site" target="_blank" rel="noopener noreferrer"><FaEye style={{marginRight: '6px'}} /> <span>View Site</span></a>
          <button className="adm-logout-btn" onClick={logout}><FaSignOutAlt style={{marginRight: '6px'}} /> <span>Logout</span></button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="adm-main">
        <div className="adm-main-header">
          <div className="adm-header-left">
            <button className="adm-hamburger" onClick={() => setSidebarOpen(true)}>☰</button>
            <div>
              <h2 className="adm-main-title">{currentTab.name}</h2>
              <p className="adm-main-sub">portfolio control</p>
            </div>
          </div>
          {showSaveBtn && (
            <div className="adm-header-actions">
              <SaveBtn onClick={handleGlobalSave} status={globalSaveStatus} isDirty={globalIsDirty} />
            </div>
          )}
        </div>

        <div className="adm-content">
          <Routes>
            <Route index element={<HeroTab portfolio={portfolio} updatePortfolio={updatePortfolio} setGlobalSave={setGlobalSave} />} />
            <Route path="about" element={<AboutTab portfolio={portfolio} updatePortfolio={updatePortfolio} setGlobalSave={setGlobalSave} />} />
            <Route path="education" element={<EducationTab portfolio={portfolio} updatePortfolio={updatePortfolio} setGlobalSave={setGlobalSave} />} />
            <Route path="skills" element={<SkillsTab portfolio={portfolio} updatePortfolio={updatePortfolio} setGlobalSave={setGlobalSave} />} />
            <Route path="projects" element={<ProjectsTab portfolio={portfolio} updatePortfolio={updatePortfolio} setGlobalSave={setGlobalSave} />} />
            <Route path="contact" element={<ContactTab portfolio={portfolio} updatePortfolio={updatePortfolio} setGlobalSave={setGlobalSave} />} />
            <Route path="messages" element={<MessagesTab />} />
            <Route path="settings" element={<SettingsTab />} />
          </Routes>
        </div>

        {/* Mobile Bottom Nav */}
        <nav className="adm-bottom-nav">
          {BOTTOM_NAV.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`adm-bottom-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setMoreOpen(false)}
            >
              <span className="adm-bottom-icon">{item.icon}</span>
              <span className="adm-bottom-label">{item.name}</span>
            </Link>
          ))}
          <button
            className={`adm-bottom-item ${moreOpen ? 'active' : ''}`}
            onClick={() => setMoreOpen(!moreOpen)}
          >
            <span className="adm-bottom-icon"><FaCog /></span>
            <span className="adm-bottom-label">More</span>
          </button>
        </nav>

        {/* Mobile More Menu */}
        {moreOpen && (
          <div className="adm-more-overlay" onClick={() => setMoreOpen(false)}>
            <div className="adm-more-menu" onClick={(e) => e.stopPropagation()}>
              <div className="adm-more-header">
                <span>More Options</span>
                <button onClick={() => setMoreOpen(false)}>✕</button>
              </div>
              <Link to="/admin/education" className="adm-more-item" onClick={() => setMoreOpen(false)}>
                <FaGraduationCap /> Education
              </Link>
              <Link to="/admin/contact" className="adm-more-item" onClick={() => setMoreOpen(false)}>
                <FaEnvelope /> Contact
              </Link>
              <Link to="/admin/messages" className="adm-more-item" onClick={() => setMoreOpen(false)}>
                <FaInbox /> Messages
              </Link>
              <Link to="/admin/settings" className="adm-more-item" onClick={() => setMoreOpen(false)}>
                <FaCog /> Settings
              </Link>
              <a href="/" className="adm-more-item" target="_blank" rel="noopener noreferrer">
                <FaEye /> View Site
              </a>
              <button className="adm-more-item logout" onClick={logout}>
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
