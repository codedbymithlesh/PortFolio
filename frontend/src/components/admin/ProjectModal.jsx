import React, { useState } from 'react';
import { FaTimes, FaPlus, FaHourglassHalf } from 'react-icons/fa';
import { Field } from './AdminCommon';

export default function ProjectModal({ project, onSave, onClose }) {
  const [edited, setEdited] = useState({ ...project, tech: [...(project.tech || [])] });
  const [uploadingProj, setUploadingProj] = useState(false);

  const update = (field, val) => setEdited(prev => ({ ...prev, [field]: val }));

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadingProj(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1000;
        let width = img.width;
        let height = img.height;
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/jpeg', 0.7);
        update('previewImage', compressed);
        setUploadingProj(false);
      };
    };
    reader.readAsDataURL(file);
  };

  const addTech = () => update('tech', [...edited.tech, '']);
  const updateTech = (i, v) => {
    const next = [...edited.tech];
    next[i] = v;
    update('tech', next);
  };
  const removeTech = (i) => update('tech', edited.tech.filter((_, idx) => idx !== i));

  return (
    <div className="adm-modal-overlay" onClick={onClose}>
      <div className="adm-modal-card" onClick={e => e.stopPropagation()}>
        <div className="adm-modal-header">
          <h3>{project.title ? 'Edit Project' : 'New Project'}</h3>
          <button className="adm-modal-close" onClick={onClose}><FaTimes /></button>
        </div>
        
        <div className="adm-modal-content">
          <div className="adm-grid-2" style={{ alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Field label="Project Title" value={edited.title} onChange={(v) => update('title', v)} />
              <Field label="Project URL" value={edited.link} onChange={(v) => update('link', v)} />
            </div>
            
            <div className="adm-field">
              <label className="adm-label">Preview Image</label>
              <div className="adm-upload-box" style={{ aspectRatio: '16/9', height: 'auto' }}>
                {edited.previewImage ? (
                  <div className="adm-upload-preview project-preview-box" style={{ height: '100%', width: 'auto' }}>
                    <img src={edited.previewImage} alt="preview" />
                    <button className="adm-preview-del" onClick={() => update('previewImage', '')}>✕</button>
                  </div>
                ) : (
                  <label className="adm-upload-btn" htmlFor="modal-proj-upload" style={{ height: '100%', width: '100%' }}>
                    {uploadingProj ? <><FaHourglassHalf style={{marginRight: '6px'}} /> Uploading...</> : <><FaPlus style={{marginRight: '6px'}} /> Upload Image</>}
                    <input id="modal-proj-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} disabled={uploadingProj} />
                  </label>
                )}
              </div>
            </div>
          </div>

          <Field label="Description" value={edited.description} onChange={(v) => update('description', v)} textarea />

          <div className="adm-section-sub">
            <div className="adm-sub-header">
              <span>Tech Stack</span>
              <button className="adm-add-btn" onClick={addTech}>+ Add</button>
            </div>
            <div className="adm-pills-edit">
              {edited.tech.map((t, i) => (
                <div key={i} className="adm-pill-row">
                  <input className="adm-input" value={t} onChange={(e) => updateTech(i, e.target.value)} />
                  <button className="adm-del-btn" onClick={() => removeTech(i)}>✕</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="adm-modal-footer">
          <button className="adm-cancel-btn" onClick={onClose}>Cancel</button>
          <button className="adm-confirm-btn" onClick={() => { onSave(edited); onClose(); }}>Confirm Changes</button>
        </div>
      </div>
    </div>
  );
}
