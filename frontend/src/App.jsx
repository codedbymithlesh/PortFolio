import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation, BrowserRouter as Router } from 'react-router-dom';
import { FaWifi, FaRedo } from 'react-icons/fa';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import ProtectedRoute from './components/ProtectedRoute';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Education from './components/Education';
import Contact from './components/Contact';
import Section from './components/Section';
import Preloader from './components/Preloader';
import DecodeText from './components/DecodeText';
import useReveal from './hooks/useReveal';
import useLenis from './hooks/useLenis';
import { PATH_TO_SECTION, scrollToSection } from './lib/navigation';

const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
import ProjectsPage from './pages/Projects';
const NotFound = lazy(() => import('./pages/NotFound'));

import './admin.css';

const MainLayout = ({ children }) => {
  const { loading, error, retry } = usePortfolio();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  useReveal(!isAdmin, `${location.pathname}:${loading}`);

  if (error) {
    return (
      <div className="status-page">
        <div className="container status-page__inner">
          <FaWifi className="status-page__icon" aria-hidden="true" />
          <h1 className="status-page__title">Connection error</h1>
          <p className="status-page__text">{error}</p>
          <button
            type="button"
            className="button button--primary"
            onClick={retry}
          >
            <FaRedo aria-hidden="true" />
            <DecodeText>Try again</DecodeText>
          </button>
        </div>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="admin-layout-root">
        <Preloader loading={loading} />
        {children}
      </div>
    );
  }

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="scroll-progress" aria-hidden="true">
        <span />
      </div>
      <Preloader loading={loading} />
      <Navbar />
      <main id="main-content" className="site-main">{children}</main>
      <Footer />
    </div>
  );
};

const PublicPage = () => {
  const { pathname, hash } = useLocation();
  const { loading } = usePortfolio();

  useEffect(() => {
    if (loading) return undefined;

    const hashSection = hash ? hash.replace('#', '') : '';
    const section = hashSection || PATH_TO_SECTION[pathname];

    if (!section) return undefined;

    const frame = window.requestAnimationFrame(() => {
      scrollToSection(section, { behavior: hash ? 'smooth' : 'auto' });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash, loading]);

  return (
    <>
      <Hero />

      <Section
        id="about"
        index="01"
        eyebrow="Profile"
        title="About"
        description="An introduction to the person behind the portfolio."
        variant="about"
      >
        <About />
      </Section>

      <Section
        id="capabilities"
        index="02"
        eyebrow="Stack"
        title="Capabilities"
        description="Frontend, backend, and the tools used to connect them."
        variant="capabilities"
      >
        <Skills />
      </Section>

      <Section
        id="work"
        index="03"
        eyebrow="Selected work"
        title="Work"
        description="Project work currently published in the portfolio."
        variant="work"
      >
        <Projects />
      </Section>

      <Section
        id="journey"
        index="04"
        eyebrow="Timeline"
        title="Journey"
        description="Education and milestones."
        variant="journey"
      >
        <Education />
      </Section>

      <Section
        id="contact"
        index="05"
        eyebrow="Get in touch"
        title="Contact"
        description="Start a conversation about a project or role."
        variant="contact"
      >
        <Contact />
      </Section>
    </>
  );
};

function App() {
  useLenis();

  return (
    <Router>
      <PortfolioProvider>
        <MainLayout>
          <Suspense fallback={<Preloader loading={true} />}>
            <Routes>
              <Route path="/" element={<PublicPage />} />
              <Route path="/about" element={<PublicPage />} />
              <Route path="/skills" element={<PublicPage />} />
              <Route path="/projects" element={<PublicPage />} />
              <Route path="/contact" element={<PublicPage />} />
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
