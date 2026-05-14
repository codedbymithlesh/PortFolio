import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  FaUser, FaInfoCircle, FaGraduationCap, FaTools, 
  FaBriefcase, FaEnvelope, FaBolt, 
  FaEye, FaSignOutAlt, FaRegEnvelopeOpen, FaCog, FaTimes, FaBars
} from 'react-icons/fa';
import { usePortfolio } from '../context/PortfolioContext';

// Import sub-components
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
  { name: 'Education', path: '/admin/education', icon: <FaGraduationCap /> },
  { name: 'Skills', path: '/admin/skills', icon: <FaTools /> },
  { name: 'Projects', path: '/admin/projects', icon: <FaBriefcase /> },
  { name: 'Contact', path: '/admin/contact', icon: <FaEnvelope /> },
  { name: 'Messages', path: '/admin/messages', icon: <FaRegEnvelopeOpen /> },
  { name: 'Settings', path: '/admin/settings', icon: <FaCog /> },
];

export default function AdminDashboard() {
  const { portfolio, loading, updatePortfolio } = usePortfolio();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  // Refresh confirmation
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (globalIsDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
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
    if (!window.confirm('Are you sure you want to logout? Any unsaved changes will be lost.')) return;
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  }, [navigate]);

  // Auto-logout after 30 minutes of inactivity
  useEffect(() => {
    let timeoutId;
    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        logout();
      }, 30 * 60 * 1000); // 30 minutes
    };
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    activityEvents.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      activityEvents.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [logout]);

  if (loading) {
    return (
      <div className="adm-loading">
        <div className="adm-spinner-big"></div>
        <p>Loading portfolio data...</p>
      </div>
    );
  }

  const currentTab = MENU_ITEMS.find(item => item.path === location.pathname) || MENU_ITEMS[0];
  const showSaveBtn = !location.pathname.includes('messages') && !location.pathname.includes('settings');

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

      <main className="adm-main">
        <div className="adm-main-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
            <button className="adm-hamburger" onClick={() => setSidebarOpen(true)}>
              <FaBars />
            </button>
            <div>
              <h2 className="adm-main-title">{currentTab.name}</h2>
              <p className="adm-main-sub">Manage your portfolio details</p>
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
      </main>
    </div>
  );
}
