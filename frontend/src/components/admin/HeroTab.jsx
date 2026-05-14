import React, { useState } from 'react';
import { FaUser, FaHourglassHalf, FaCheck, FaTimes, FaPlus } from 'react-icons/fa';
import { usePortfolio } from '../../context/PortfolioContext';
import { Field, useSave } from './AdminCommon';

export default function HeroTab({ portfolio, updatePortfolio, setGlobalSave }) {
  const { API } = usePortfolio();
  const [hero, setHero] = useState({ ...portfolio.hero });
  const isDirty = JSON.stringify(hero) !== JSON.stringify(portfolio.hero);
  const [status, save] = useSave('hero', hero, updatePortfolio, setGlobalSave, isDirty);
  const [uploadStatus, setUploadStatus] = useState('');
  const set = (k) => (v) => setHero((h) => ({ ...h, [k]: v }));

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadStatus('uploading');
    const formData = new FormData();
    formData.append('image', file);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${API}/upload/profile`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setHero((h) => ({ ...h, profileImage: data.url }));
        setUploadStatus('done');
      } else {
        setUploadStatus('error');
      }
    } catch {
      setUploadStatus('error');
    }
    setTimeout(() => setUploadStatus(''), 3000);
  };

  return (
    <div className="adm-tab-panel">
      <div className="adm-panel-header">
        <h3 className="adm-panel-title"><FaUser style={{marginRight: '10px'}} /> Hero Section</h3>
      </div>
      <div className="adm-grid-2">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
          <Field label="Full Name" value={hero.name} onChange={set('name')} />
          <Field label="Subtitle / Role" value={hero.subtitle} onChange={set('subtitle')} />
          <Field label="Bio" value={hero.bio} onChange={set('bio')} textarea />
        </div>

        <div className="adm-field">
          <label className="adm-label">Profile Picture</label>
          <div className="adm-upload-box" style={{ height: '100%', justifyContent: 'center' }}>
            {hero.profileImage && (
              <div className="adm-upload-preview" style={{ width: '120px', height: '120px' }}>
                <img src={hero.profileImage} alt="profile preview" loading="lazy" />
              </div>
            )}
            <label className="adm-upload-btn" htmlFor="profile-upload">
              {uploadStatus === 'uploading' ? <><FaHourglassHalf style={{marginRight: '6px'}} /> Uploading...</> : uploadStatus === 'done' ? <><FaCheck style={{marginRight: '6px'}} /> Uploaded!</> : uploadStatus === 'error' ? <><FaTimes style={{marginRight: '6px'}} /> Failed</> : <><FaPlus style={{marginRight: '6px'}} /> Choose Image File</>}
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
            </label>
            <span className="adm-upload-hint">JPG, PNG, WebP — max 5MB</span>
          </div>
        </div>
      </div>
    </div>
  );
}
