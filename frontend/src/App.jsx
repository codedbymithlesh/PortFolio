import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { FaWifi, FaRedo } from 'react-icons/fa';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Projects from './pages/Projects';
import NotFound from './pages/NotFound';

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

import './admin.css';

import { useLocation, useNavigate } from 'react-router-dom';

function Portfolio() {
  const { portfolio, loading, error } = usePortfolio();
  const location = useLocation();
  const navigate = useNavigate();

  // Handle Title
  React.useEffect(() => {
    if (portfolio.hero.name) {
      document.title = `${portfolio.hero.name} | Portfolio`;
    }
  }, [portfolio.hero.name]);

  // Handle deep linking (scroll to section on load/path change)
  React.useEffect(() => {
    const path = location.pathname.replace('/', '');
    if (!path) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const sectionMap = {
      'about': 'universe',
      'skills': 'tech',
      'projects': 'builds',
      'contact': 'contact'
    };

    const targetId = sectionMap[path];
    if (targetId) {
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          const offset = 100; // Adjust for sticky navbar
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = el.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }, [location.pathname]);

  // Handle URL update on scroll (Scroll Spy)
  React.useEffect(() => {
    const sections = [
      { id: 'home', path: '/' },
      { id: 'universe', path: '/about' },
      { id: 'tech', path: '/skills' },
      { id: 'builds', path: '/projects' },
      { id: 'contact', path: '/contact' }
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const section = sections.find((s) => s.id === entry.target.id);
            if (section && window.location.pathname !== section.path) {
              window.history.replaceState(null, '', section.path);
            }
          }
        });
      },
      { rootMargin: '-40% 0px -40% 0px' }
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Protection: Disable Right Click on Portfolio
  React.useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);

    // Intersection Observer for Scroll Reveal
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      observer.disconnect();
    };
  }, [loading]); // Re-run when loading finishes to catch newly rendered elements

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
          <div className="reveal"><Hero /></div>
          <section id="universe" className="section-grid reveal">
            <MyUniverse />
            <Education />
          </section>
          <div className="reveal"><TechArsenal /></div>
          <div className="reveal"><FeaturedBuilds /></div>
          <div className="reveal"><Contact /></div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <PortfolioProvider>
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/about" element={<Portfolio />} />
          <Route path="/skills" element={<Portfolio />} />
          <Route path="/projects" element={<Portfolio />} />
          <Route path="/contact" element={<Portfolio />} />
          <Route path="/all-projects" element={<Projects />} />
          
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PortfolioProvider>
    </Router>
  );
}

export default App;
