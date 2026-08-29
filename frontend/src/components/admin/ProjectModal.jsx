import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { Field } from './AdminCommon';

export default function ProjectModal({ project, onSave, onClose }) {
  const [edited, setEdited] = useState({ ...project, tech: [...(project.tech || [])] });

  const update = (field, val) => setEdited(prev => ({ ...prev, [field]: val }));

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
          <Field label="Project Title" value={edited.title} onChange={(v) => update('title', v)} />
          <div className="adm-grid-2">
            <Field label="Live URL" value={edited.link} onChange={(v) => update('link', v)} />
            <Field label="Code URL (Optional)" value={edited.codeLink || ''} onChange={(v) => update('codeLink', v)} />
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
                  <button className="adm-del-btn" onClick={() => removeTech(i)}>x</button>
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
