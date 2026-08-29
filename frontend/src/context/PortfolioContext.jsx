import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const API = 'https://port-folio-backend-file.vercel.app/api';

const PortfolioContext = createContext(null);


const emptyData = {
  hero: {
    name: '',
    subtitle: '',
    bio: '',
    profileImage: '',
  },
  about: {
    professionalSummary: '',
    quote: '',
    badges: [],
  },
  education: [],
  skills: {
    frontend: [],
    backend: [],
    tools: [],
  },
  projects: [],
  contact: {
    email: '',
    location: '',
    github: '',
    linkedin: '',
    youtube: '',
  },
};

function parsePortfolio(data) {
  if (!data) return emptyData;
  return {
    hero:      { ...emptyData.hero,      ...(data.hero      || {}) },
    about:     { ...emptyData.about,     ...(data.about     || {}), badges: Array.isArray(data.about?.badges) ? data.about.badges : [] },
    education: Array.isArray(data.education) ? data.education : [],
    skills: {
      frontend: Array.isArray(data.skills?.frontend) ? data.skills.frontend : [],
      backend:  Array.isArray(data.skills?.backend)  ? data.skills.backend  : [],
      tools:    Array.isArray(data.skills?.tools)    ? data.skills.tools    : [],
    },
    projects:  Array.isArray(data.projects) ? data.projects : [],
    contact:   { ...emptyData.contact,  ...(data.contact   || {}) },
  };
}

export function PortfolioProvider({ children }) {
  const [portfolio, setPortfolio] = useState(emptyData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const portfolioRef = useRef(portfolio);
  portfolioRef.current = portfolio;

  useEffect(() => {
    fetch(`${API}/portfolio`)
      .then((r) => {
        if (!r.ok) throw new Error('Server error');
        return r.json();
      })
      .then((data) => {
        if (data && data._id) {
          const parsed = parsePortfolio(data);
          setPortfolio(parsed);
          portfolioRef.current = parsed;
        }
      })
      .catch((err) => {
        console.error('Failed to fetch portfolio data', err);
        setError('Please check your internet connection or try again later.');
      })
      .finally(() => setLoading(false));
  }, []);

  const updatePortfolio = useCallback(async (section, value) => {
    const token = localStorage.getItem('admin_token');
    const currentPortfolio = portfolioRef.current;
    const updated = { ...currentPortfolio, [section]: value };
    setPortfolio(updated);
    portfolioRef.current = updated;
    try {
      const res = await fetch(`${API}/portfolio`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(updated),
      });
      const result = await res.json();
      if (!res.ok) {
        console.error('Save failed:', result.message || result.error);
        setPortfolio(currentPortfolio);
        portfolioRef.current = currentPortfolio;
        return false;
      }
      if (result.data) {
        const parsed = parsePortfolio(result.data);
        setPortfolio(parsed);
        portfolioRef.current = parsed;
      }
      return true;
    } catch (err) {
      console.error('Save error:', err);
      setPortfolio(currentPortfolio);
      portfolioRef.current = currentPortfolio;
      return false;
    }
  }, []);

  const value = React.useMemo(() => ({
    portfolio,
    loading,
    error,
    updatePortfolio,
    API
  }), [portfolio, loading, error, updatePortfolio]);

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider');
  return ctx;
}
