import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Projects from './pages/Projects';

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
  const { portfolio, loading } = usePortfolio();

  React.useEffect(() => {
    if (portfolio.hero.name) {
      document.title = `${portfolio.hero.name} | Portfolio`;
    } else {
      document.title = 'My Portfolio';
    }
  }, [portfolio.hero.name]);

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
        </Routes>
      </PortfolioProvider>
    </Router>
  );
}

export default App;
