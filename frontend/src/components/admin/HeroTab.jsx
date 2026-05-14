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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadStatus('uploading');
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 600; // Profile pics can be smaller
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        const compressed = canvas.toDataURL('image/jpeg', 0.8);
        setHero((h) => ({ ...h, profileImage: compressed }));
        setUploadStatus('done');
        setTimeout(() => setUploadStatus(''), 3000);
      };
    };
    reader.readAsDataURL(file);
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
                <button 
                  className="adm-preview-del" 
                  onClick={() => setHero(h => ({ ...h, profileImage: 'https://res.cloudinary.com/dhepliygh/image/upload/f_auto,q_auto/person_zcnmuw' }))}
                  title="Restore Default"
                >
                  ✕
                </button>
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
