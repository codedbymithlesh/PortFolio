import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate, BrowserRouter as Router } from 'react-router-dom';
import { FaWifi, FaRedo } from 'react-icons/fa';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import ProtectedRoute from './components/ProtectedRoute';

// Components
import ParticlesBackground from './components/ParticlesBackground';
import AnimatedGrid from './components/AnimatedGrid';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MyUniverse from './components/About';
import Education from './components/Education';
import TechArsenal from './components/Skills';
import FeaturedBuilds from './components/Projects';
import Contact from './components/Contact';
import Preloader from './components/Preloader';

// Pages
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
import ProjectsPage from './pages/Projects';
const NotFound = lazy(() => import('./pages/NotFound'));

import './admin.css';

const MainLayout = ({ children }) => {
  const { portfolio, loading, error } = usePortfolio();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  // Scroll Reveal Observer
  useEffect(() => {
    if (loading || isAdmin) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [loading, children, isAdmin]);

  if (error) {
    return (
      <div className="error-screen">
        <FaWifi className="error-icon" />
        <h2 className="error-title">Connection Error</h2>
        <p className="error-text">{error}</p>
        <button className="btn-primary" onClick={() => window.location.reload()}>
          <FaRedo style={{marginRight: '8px'}} /> Try Again
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
      <Preloader loading={loading} />
      <ParticlesBackground />
      <AnimatedGrid />
      <div className="background-animations">
        <div className="bg-blob blob-1"></div>
        <div className="bg-blob blob-2"></div>
        <div className="bg-blob blob-3"></div>
      </div>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

const Portfolio = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname === '/' || pathname === '') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (pathname === '/about') {
      document.getElementById('universe')?.scrollIntoView({ behavior: 'smooth' });
    } else if (pathname === '/skills') {
      document.getElementById('tech')?.scrollIntoView({ behavior: 'smooth' });
    } else if (pathname === '/projects') {
      document.getElementById('builds')?.scrollIntoView({ behavior: 'smooth' });
    } else if (pathname === '/contact') {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [pathname]);

  useEffect(() => {
    // Holographic Sheen for Cards
    const handleMouseMove = (e) => {
      const cards = document.querySelectorAll('.card, .showcase-text-box, .archive-card');
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });

      // Magnetic Buttons
      const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .showcase-btn, .action-btn');
      buttons.forEach((btn) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;
        const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

        if (distance < 100) {
          const pushX = distanceX * 0.15;
          const pushY = distanceY * 0.15;
          btn.style.transform = `translate(${pushX}px, ${pushY}px) scale(1.05)`;
        } else {
          btn.style.transform = '';
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <div className="reveal"><Hero /></div>
      <section id="universe" className="about-dashboard reveal">
        <div className="about-main">
          <MyUniverse showSummaryOnly={true} />
        </div>
        <div className="about-side">
          <MyUniverse showStrengthsOnly={true} />
        </div>
        <div className="about-bottom">
          <Education />
        </div>
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
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </MainLayout>
      </PortfolioProvider>
    </Router>
  );
}

export default App;
