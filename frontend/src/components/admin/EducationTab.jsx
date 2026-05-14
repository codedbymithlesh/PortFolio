import React, { useState, useRef } from 'react';
import { FaGraduationCap } from 'react-icons/fa';
import { Field, useSave } from './AdminCommon';

export default function EducationTab({ portfolio, updatePortfolio, setGlobalSave }) {
  const [edu, setEdu] = useState(portfolio.education.map((e) => ({ ...e })));
  const isDirty = JSON.stringify(edu) !== JSON.stringify(portfolio.education);
  const [status, save] = useSave('education', edu, updatePortfolio, setGlobalSave, isDirty);

  const update = (i, field, val) => {
    const next = [...edu];
    next[i] = { ...next[i], [field]: val };
    setEdu(next);
  };
  const scrollRef = useRef(null);
  const add = () => {
    setEdu((e) => [...e, { year: '', title: '', description: '', dotColor: 'blue' }]);
    setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 100);
  };
  const remove = (i) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;
    setEdu((e) => e.filter((_, idx) => idx !== i));
  };

  return (
    <div className="adm-tab-panel" ref={scrollRef}>
      <div className="adm-panel-header">
        <h3 className="adm-panel-title"><FaGraduationCap style={{marginRight: '10px'}} /> Education & Certs</h3>
      </div>
      <button className="adm-add-btn adm-add-block" onClick={add}>+ Add Entry</button>
      <div className="adm-grid-2" style={{ alignItems: 'start' }}>
        {edu.map((item, i) => (
          <div key={i} className="adm-card-row">
            <div className="adm-card-row-header">
              <span className="adm-card-row-num">#{i + 1}</span>
              <button className="adm-del-btn" onClick={() => remove(i)}>✕ Remove</button>
            </div>
            <div className="adm-grid-2">
              <Field label="Year / Date" value={item.year} onChange={(v) => update(i, 'year', v)} />
              <div className="adm-field">
                <label className="adm-label">Dot Color</label>
                <select className="adm-select" value={item.dotColor} onChange={(e) => update(item.dotColor, 'dotColor', e.target.value)}>
                  <option value="orange">Gold</option>
                  <option value="blue">Red-Light</option>
                  <option value="red">Red</option>
                  <option value="cyan">Gold-Light</option>
                </select>
              </div>
            </div>
            <Field label="Title" value={item.title} onChange={(v) => update(i, 'title', v)} />
            <Field label="Description" value={item.description} onChange={(v) => update(i, 'description', v)} textarea />
          </div>
        ))}
      </div>
    </div>
  );
}
