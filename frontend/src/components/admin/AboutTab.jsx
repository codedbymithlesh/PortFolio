import React, { useState, useRef } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { Field, useSave } from './AdminCommon';

export default function AboutTab({ portfolio, updatePortfolio, setGlobalSave }) {
  const [about, setAbout] = useState({ ...portfolio.about, badges: [...(portfolio.about.badges || [])] });
  const isDirty = JSON.stringify(about) !== JSON.stringify(portfolio.about);
  const [status, save] = useSave('about', about, updatePortfolio, setGlobalSave, isDirty);
  const set = (k) => (v) => setAbout((a) => ({ ...a, [k]: v }));

  const updateBadge = (i, field, val) => {
    const badges = [...about.badges];
    badges[i] = { ...badges[i], [field]: val };
    setAbout((a) => ({ ...a, badges }));
  };
  const scrollRef = useRef(null);
  const addBadge = () => {
    setAbout((a) => ({ ...a, badges: [...a.badges, { label: 'New Badge', type: 'orange' }] }));
    setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 100);
  };
  const removeBadge = (i) => {
    if (!window.confirm('Are you sure you want to delete this badge?')) return;
    setAbout((a) => ({ ...a, badges: a.badges.filter((_, idx) => idx !== i) }));
  };

  return (
    <div className="adm-tab-panel">
      <div className="adm-panel-header">
        <h3 className="adm-panel-title"><FaInfoCircle style={{marginRight: '10px'}} /> About / Universe</h3>
      </div>
      <div className="adm-grid-2">
        <Field label="Professional Summary" value={about.professionalSummary} onChange={set('professionalSummary')} textarea />
        <Field label="Goal Quote" value={about.quote} onChange={set('quote')} textarea />
      </div>
      <div className="adm-section-sub">
        <div className="adm-sub-header">
          <span>Badges</span>
          <button className="adm-add-btn" onClick={addBadge}>+ Add Badge</button>
        </div>
        <div className="adm-pills-edit" ref={scrollRef}>
          {(about.badges || []).map((b, i) => (
            <div key={i} className="adm-array-row">
              <input className="adm-input" value={b.label} onChange={(e) => updateBadge(i, 'label', e.target.value)} placeholder="Badge label" />
              <select className="adm-select" value={b.type} onChange={(e) => updateBadge(i, 'type', e.target.value)}>
                <option value="orange">Gold</option>
                <option value="red">Red</option>
              </select>
              <button className="adm-del-btn" onClick={() => removeBadge(i)}>✕</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
