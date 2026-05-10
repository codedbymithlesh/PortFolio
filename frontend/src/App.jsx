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
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MyUniverse from './components/About';
import Education from './components/Education';
import TechArsenal from './components/Skills';
import FeaturedBuilds from './components/Projects';
import Contact from './components/Contact';
import Preloader from './components/Preloader';

import './admin.css';

function Portfolio() {
  const { portfolio, loading, error } = usePortfolio();

  React.useEffect(() => {
    if (portfolio.hero.name) {
      document.title = `${portfolio.hero.name} | Portfolio`;
    } else {
      document.title = 'My Portfolio';
    }
  }, [portfolio.hero.name]);

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
    <>
      <Preloader loading={loading} />
      <ParticlesBackground />
      <div className="background-animations">
        <div className="bg-blob blob-1"></div>
        <div className="bg-blob blob-2"></div>
        <div className="bg-blob blob-3"></div>
      </div>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Hero />
          <section id="universe" className="section-grid">
            <MyUniverse />
            <Education />
          </section>
          <TechArsenal />
          <FeaturedBuilds />
          <Contact />
        </main>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <PortfolioProvider>
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/projects" element={<Projects />} />
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
