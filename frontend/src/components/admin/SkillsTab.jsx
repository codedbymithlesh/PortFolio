import React, { useState, useRef } from 'react';
import { FaTools, FaPlus, FaLightbulb, FaTrash } from 'react-icons/fa';
import { useSave } from './AdminCommon';

// Curated dictionary of popular technical suggestions
const SUGGESTIONS = {
  frontend: ['React.js', 'Next.js', 'TypeScript', 'TailwindCSS', 'JavaScript', 'HTML5', 'CSS3', 'Sass', 'Framer Motion'],
  backend: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'REST APIs', 'GraphQL', 'Python', 'Docker', 'Firebase'],
  tools: ['Figma', 'Git / GitHub', 'VS Code', 'AWS', 'Vercel', 'Postman', 'Linux', 'Photoshop', 'npm / yarn']
};

const SkillList = ({ category, label, skills, setSkills }) => {
  const list = skills[category];
  const scrollRef = useRef(null);

  const update = (i, v) => setSkills((s) => {
    const next = [...s[category]];
    next[i] = v;
    return { ...s, [category]: next };
  });

  const add = (val = '') => {
    setSkills((s) => ({ ...s, [category]: [...s[category], val] }));
    setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 100);
  };

  const remove = (i) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;
    setSkills((s) => ({ ...s, [category]: s[category].filter((_, idx) => idx !== i) }));
  };

  const addSuggested = (tech) => {
    if (list.includes(tech)) return;
    add(tech);
  };

  return (
    <div className="adm-section-sub" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="adm-sub-header" style={{ marginBottom: '1rem' }}>
        <span>{label}</span>
        <button className="adm-add-btn" onClick={() => add()}>
          <FaPlus style={{ marginRight: '4px' }} /> Add Skill
        </button>
      </div>

      <div className="adm-pills-edit" ref={scrollRef} style={{ flex: 1 }}>
        {list.map((s, i) => (
          <div key={i} className="adm-pill-row">
            <input 
              className="adm-input" 
              value={s} 
              onChange={(e) => update(i, e.target.value)} 
              placeholder="Skill name"
            />
            <button className="adm-del-btn" onClick={() => remove(i)} title="Delete Skill">
              ✕
            </button>
          </div>
        ))}
        {list.length === 0 && (
          <div style={{ color: 'var(--adm-text-dark)', fontSize: '0.82rem', padding: '0.5rem 0' }}>
            No skills added. Click "Add Skill" or select suggestions below.
          </div>
        )}
      </div>

      {/* Suggestion drawer with high-tech badges */}
      <div className="adm-suggestions-box" style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px', 
          fontSize: '0.7rem', 
          fontWeight: 800, 
          color: 'var(--adm-text-dark)', 
          textTransform: 'uppercase', 
          marginBottom: '0.75rem', 
          letterSpacing: '1px' 
        }}>
          <FaLightbulb style={{ color: 'var(--adm-accent-gold)' }} /> Quick Suggestions
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
          {SUGGESTIONS[category].map((tech) => {
            const isAdded = list.includes(tech);
            return (
              <button
                key={tech}
                type="button"
                onClick={() => addSuggested(tech)}
                disabled={isAdded}
                className="adm-add-btn"
                style={{
                  padding: '0.3rem 0.6rem',
                  fontSize: '0.75rem',
                  borderRadius: '6px',
                  opacity: isAdded ? 0.35 : 1,
                  cursor: isAdded ? 'default' : 'pointer',
                  background: isAdded ? 'transparent' : 'rgba(253, 186, 116, 0.03)',
                  borderColor: isAdded ? 'rgba(255,255,255,0.05)' : 'rgba(253, 186, 116, 0.15)',
                  color: isAdded ? 'var(--adm-text-dark)' : 'var(--adm-accent-gold)',
                  transition: 'all 0.2s'
                }}
              >
                {tech}
              </button>
            );
          })}
        </div>
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
        <h3 className="adm-panel-title">
          <FaTools style={{ marginRight: '10px', color: 'var(--adm-accent-red)' }} /> 
          Tech Arsenal & Skills
        </h3>
      </div>

      {/* Adaptive 3-column bento grid */}
      <div className="skills-bento-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '1.75rem', 
        alignItems: 'stretch' 
      }}>
        <SkillList category="frontend" label="Frontend Tech" skills={skills} setSkills={setSkills} />
        <SkillList category="backend" label="Backend & Database" skills={skills} setSkills={setSkills} />
        <SkillList category="tools" label="Tools & Design Work" skills={skills} setSkills={setSkills} />
      </div>
    </div>
  );
}
