import React, { createContext, useContext, useState, useEffect } from 'react';

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

export function PortfolioProvider({ children }) {
  const [portfolio, setPortfolio] = useState(emptyData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API}/portfolio`)
      .then((r) => {
        if (!r.ok) throw new Error('Server error');
        return r.json();
      })
      .then((data) => {
        if (data && data._id) {
          setPortfolio({
            hero:      { ...emptyData.hero,      ...(data.hero      || {}) },
            about:     { ...emptyData.about,     ...(data.about     || {}), badges: (data.about?.badges || []) },
            education: data.education || [],
            skills:    {
              frontend: data.skills?.frontend || [],
              backend:  data.skills?.backend  || [],
              tools:    data.skills?.tools    || [],
            },
            projects:  data.projects || [],
            contact:   { ...emptyData.contact,  ...(data.contact   || {}) },
          });
        }
      })
      .catch((err) => {
        console.error('Failed to fetch portfolio data', err);
        setError('Please check your internet connection or try again later.');
      })
      .finally(() => setLoading(false));
  }, []);

  const updatePortfolio = async (section, value) => {
    const token = localStorage.getItem('admin_token');
    const updated = { ...portfolio, [section]: value };
    setPortfolio(updated);
    try {
      const res = await fetch(`${API}/portfolio`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(updated),
      });
      return res.ok;
    } catch {
      return false;
    }
  };

  return (
    <PortfolioContext.Provider value={{ portfolio, loading, error, updatePortfolio, API }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider');
  return ctx;
}
