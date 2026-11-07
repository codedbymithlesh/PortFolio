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
  const mountedRef = useRef(true);
  const retryCountRef = useRef(0);

  /* Keep ref in sync via effect, never during render. */
  useEffect(() => {
    portfolioRef.current = portfolio;
  }, [portfolio]);

  const FETCH_TIMEOUT_MS = 10000; // per-attempt timeout
  const MAX_RETRIES = 3;
  const RETRY_DELAY_MS = 2000;

  const fetchWithRetry = useCallback(async (retries = MAX_RETRIES, delay = RETRY_DELAY_MS) => {
    for (let i = 0; i < retries; i++) {
      if (!mountedRef.current) return;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

      try {
        const r = await fetch(`${API}/portfolio`, { signal: controller.signal });
        if (!r.ok) throw new Error('Server error');
        const data = await r.json();
        if (!mountedRef.current) return;
        if (data && data._id) {
          const parsed = parsePortfolio(data);
          setPortfolio(parsed);
          portfolioRef.current = parsed;
          setError(null);
        }
        return;
      } catch (err) {
        if (!mountedRef.current) return;
        if (err.name === 'AbortError') {
          console.error(`Fetch attempt ${i + 1} timed out after ${FETCH_TIMEOUT_MS}ms`);
        } else {
          console.error(`Fetch attempt ${i + 1} failed:`, err.message);
        }
        if (i < retries - 1) {
          await new Promise(res => setTimeout(res, delay));
        }
      } finally {
        clearTimeout(timeoutId);
      }
    }
    if (mountedRef.current) {
      setError('Please check your internet connection or try again later.');
    }
  }, []);

  /* Retry exposed for the error page / manual recovery. */
  const retry = useCallback(() => {
    if (!mountedRef.current) return;
    retryCountRef.current = 0;
    setError(null);
    setLoading(true);
    fetchWithRetry(MAX_RETRIES, RETRY_DELAY_MS).finally(() => {
      if (mountedRef.current) setLoading(false);
    });
  }, [fetchWithRetry]);

  useEffect(() => {
    mountedRef.current = true;
    let cancelled = false;

    const run = async () => {
      await fetchWithRetry(MAX_RETRIES, RETRY_DELAY_MS);
      if (!cancelled && mountedRef.current) {
        setLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
      mountedRef.current = false;
    };
  }, [fetchWithRetry]);

  /* Global safety net: if loading takes too long, stop the preloader and show error. */
  useEffect(() => {
    if (!loading) return undefined;
    const timer = setTimeout(() => {
      if (mountedRef.current && loading) {
        setError('The portfolio is taking longer than usual to load. Please try again.');
        setLoading(false);
      }
    }, 20000);
    return () => clearTimeout(timer);
  }, [loading]);

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
    retry,
    API
  }), [portfolio, loading, error, updatePortfolio, retry]);

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
