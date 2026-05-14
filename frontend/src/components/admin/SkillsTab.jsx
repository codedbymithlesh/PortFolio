import React, { useState, useRef } from 'react';
import { FaTools } from 'react-icons/fa';
import { useSave } from './AdminCommon';

const SkillList = ({ category, label, skills, setSkills }) => {
  const list = skills[category];
  const update = (i, v) => setSkills((s) => { const next = [...s[category]]; next[i] = v; return { ...s, [category]: next }; });
  const scrollRef = useRef(null);
  const add = () => {
    setSkills((s) => ({ ...s, [category]: [...s[category], ''] }));
    setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 100);
  };
  const remove = (i) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;
    setSkills((s) => ({ ...s, [category]: s[category].filter((_, idx) => idx !== i) }));
  };

  return (
    <div className="adm-section-sub">
      <div className="adm-sub-header">
        <span>{label}</span>
        <button className="adm-add-btn" onClick={add}>+ Add</button>
      </div>
      <div className="adm-pills-edit" ref={scrollRef}>
        {list.map((s, i) => (
          <div key={i} className="adm-pill-row">
            <input className="adm-input" value={s} onChange={(e) => update(i, e.target.value)} />
            <button className="adm-del-btn" onClick={() => remove(i)}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function SkillsTab({ portfolio, updatePortfolio, setGlobalSave }) {
  const [skills, setSkills] = useState({
    frontend: [...(portfolio.skills.frontend || [])],
    backend: [...(portfolio.skills.backend || [])],
    tools: [...(portfolio.skills.tools || [])],
  });
  const isDirty = JSON.stringify(skills) !== JSON.stringify(portfolio.skills);
  const [status, save] = useSave('skills', skills, updatePortfolio, setGlobalSave, isDirty);

  return (
    <div className="adm-tab-panel">
      <div className="adm-panel-header">
        <h3 className="adm-panel-title"><FaTools style={{marginRight: '10px'}} /> Tech Arsenal / Skills</h3>
      </div>
      <div className="adm-grid-2" style={{ alignItems: 'start' }}>
        <SkillList category="frontend" label="Frontend" skills={skills} setSkills={setSkills} />
        <SkillList category="backend" label="Backend & DB" skills={skills} setSkills={setSkills} />
        <SkillList category="tools" label="Tools & Design" skills={skills} setSkills={setSkills} />
      </div>
    </div>
  );
}
