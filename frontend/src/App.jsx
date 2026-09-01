import React, { Suspense, lazy, useEffect, useState, useCallback } from 'react';
import { Routes, Route, useLocation, BrowserRouter as Router } from 'react-router-dom';
import { FaWifi, FaRedo } from 'react-icons/fa';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import ProtectedRoute from './components/ProtectedRoute';

import TechnicalBackground from './components/TechnicalBackground';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MyUniverse from './components/About';
import Education from './components/Education';
import TechArsenal from './components/Skills';
import FeaturedBuilds from './components/Projects';
import Contact from './components/Contact';
import Preloader from './components/Preloader';
import useLiquidWave from './hooks/useLiquidWave';

const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
import ProjectsPage from './pages/Projects';
const NotFound = lazy(() => import('./pages/NotFound'));

import './admin.css';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

const MainLayout = ({ children }) => {
  const { loading, error } = usePortfolio();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  useLiquidWave();

  useEffect(() => {
    if (loading || isAdmin) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [loading, isAdmin]);

  if (error) {
    document.body.classList.remove('has-custom-cursor');
    return (
      <div className="error-screen">
        <FaWifi className="error-icon" />
        <h2 className="error-title">Connection Error</h2>
        <p className="error-text">{error}</p>
        <button className="btn-primary" onClick={() => window.location.reload()}>
          <FaRedo style={{ marginRight: '8px' }} /> Try Again
        </button>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="admin-layout-root no-copy">
        <Preloader loading={loading} />
        {children}
      </div>
    );
  }

  return (
    <div className="no-copy">
      <CustomCursor />
      <Preloader loading={loading} />
      <TechnicalBackground />
      <div className="app-container">
        <Navbar />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
};

const Portfolio = () => {
  const { pathname } = useLocation();
  const { portfolio } = usePortfolio();
  const isMobile = useIsMobile();
  const [mobilePage, setMobilePage] = useState('home');
  const [direction, setDirection] = useState(1);

  const pageOrder = ['home', 'about', 'skills', 'projects', 'contact'];

  const getPageFromPath = useCallback((path) => {
    if (path === '/' || path === '') return 'home';
    if (path === '/about') return 'about';
    if (path === '/skills') return 'skills';
    if (path === '/projects') return 'projects';
    if (path === '/contact') return 'contact';
    return 'home';
  }, []);

  useEffect(() => {
    if (!isMobile) return;
    const newPage = getPageFromPath(pathname);
    const oldIndex = pageOrder.indexOf(mobilePage);
    const newIndex = pageOrder.indexOf(newPage);
    setDirection(newIndex >= oldIndex ? 1 : -1);
    setMobilePage(newPage);
  }, [pathname, isMobile, pageOrder, mobilePage, getPageFromPath]);

  useEffect(() => {
    if (isMobile) return;
    if (pathname === '/' || pathname === '') {
      window.scrollTo(0, 0);
    } else if (pathname === '/about') {
      document.getElementById('universe')?.scrollIntoView({ behavior: 'instant' });
    } else if (pathname === '/skills') {
      document.getElementById('tech')?.scrollIntoView({ behavior: 'instant' });
    } else if (pathname === '/projects') {
      document.getElementById('builds')?.scrollIntoView({ behavior: 'instant' });
    } else if (pathname === '/contact') {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'instant' });
    }
  }, [pathname, isMobile]);

  if (isMobile) {
    const slideClass = direction > 0 ? 'mobile-slide-left' : 'mobile-slide-right';
    return (
      <div className="mobile-pages">
        {mobilePage === 'home' && (
          <div key="home" className={`mobile-page ${slideClass}`}>
            <Hero />
          </div>
        )}
        {mobilePage === 'about' && (
          <div key="about" className={`mobile-page ${slideClass}`}>
            <section id="universe" className="about-dashboard">
              <div className="about-main"><MyUniverse showSummaryOnly={true} /></div>
              <div className="about-side"><MyUniverse showStrengthsOnly={true} /></div>
              <div className="about-bottom"><Education /></div>
            </section>
          </div>
        )}
        {mobilePage === 'skills' && (
          <div key="skills" className={`mobile-page ${slideClass}`}>
            <TechArsenal />
          </div>
        )}
        {mobilePage === 'projects' && (
          <div key="projects" className={`mobile-page ${slideClass}`}>
            <FeaturedBuilds />
          </div>
        )}
        {mobilePage === 'contact' && (
          <div key="contact" className={`mobile-page ${slideClass}`}>
            <Contact />
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="reveal"><Hero /></div>
      <section id="universe" className="about-dashboard reveal">
        <div className="about-main"><MyUniverse showSummaryOnly={true} /></div>
        <div className="about-side"><MyUniverse showStrengthsOnly={true} /></div>
        <div className="about-bottom"><Education /></div>
      </section>
      <div className="reveal"><TechArsenal /></div>
      <div className="reveal"><FeaturedBuilds /></div>
      <div className="reveal"><Contact /></div>
    </>
  );
};

function App() {
  return (
    <Router>
      <PortfolioProvider>
        <MainLayout>
          <Suspense fallback={<Preloader loading={true} />}>
            <Routes>
              <Route path="/" element={<Portfolio />} />
              <Route path="/about" element={<Portfolio />} />
              <Route path="/skills" element={<Portfolio />} />
              <Route path="/projects" element={<Portfolio />} />
              <Route path="/contact" element={<Portfolio />} />
              <Route path="/all-projects" element={<ProjectsPage />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/*" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </MainLayout>
      </PortfolioProvider>
    </Router>
  );
}

export default App;
