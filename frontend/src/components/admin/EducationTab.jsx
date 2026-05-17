import React, { useState, useRef } from 'react';
import { 
  FaGraduationCap, FaArrowUp, FaArrowDown, FaTrash, 
  FaPlus, FaChevronDown, FaChevronUp, FaExpand, FaCompress 
} from 'react-icons/fa';
import { Field, useSave } from './AdminCommon';

const getDotColorHex = (color) => {
  switch (color) {
    case 'orange': return '#fdba74';
    case 'blue': return '#ff647c';
    case 'red': return '#f43f5e';
    case 'cyan': return '#fed7aa';
    default: return '#fdba74';
  }
};

export default function EducationTab({ portfolio, updatePortfolio, setGlobalSave }) {
  const [edu, setEdu] = useState(portfolio.education.map((e) => ({ ...e })));
  const isDirty = JSON.stringify(edu) !== JSON.stringify(portfolio.education);
  const [status, save] = useSave('education', edu, updatePortfolio, setGlobalSave, isDirty);

  // Expanded indexes tracker (by default, expand the first card)
  const [expandedIdxs, setExpandedIdxs] = useState([0]);

  const update = (i, field, val) => {
    const next = [...edu];
    next[i] = { ...next[i], [field]: val };
    setEdu(next);
  };

  const scrollRef = useRef(null);

  const toggleExpand = (idx) => {
    if (expandedIdxs.includes(idx)) {
      setExpandedIdxs(expandedIdxs.filter(i => i !== idx));
    } else {
      setExpandedIdxs([...expandedIdxs, idx]);
    }
  };

  const expandAll = () => setExpandedIdxs(edu.map((_, idx) => idx));
  const collapseAll = () => setExpandedIdxs([]);

  const add = () => {
    setEdu((e) => [{ year: '2026', title: 'New Certificate/Degree', description: '', dotColor: 'orange' }, ...e]);
    setExpandedIdxs(prev => [0, ...prev.map(idx => idx + 1)]); // Auto-expand at index 0 and shift existing states
    setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  const remove = (i) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;
    setEdu((e) => e.filter((_, idx) => idx !== i));
    setExpandedIdxs(expandedIdxs.filter(idx => idx !== i).map(idx => idx > i ? idx - 1 : idx));
  };

  const moveUp = (i) => {
    if (i === 0) return;
    setEdu((e) => {
      const next = [...e];
      const temp = next[i];
      next[i] = next[i - 1];
      next[i - 1] = temp;
      return next;
    });
    // Shift expanded index states matching their swap
    setExpandedIdxs(prev => prev.map(idx => {
      if (idx === i) return i - 1;
      if (idx === i - 1) return i;
      return idx;
    }));
  };

  const moveDown = (i) => {
    if (i === edu.length - 1) return;
    setEdu((e) => {
      const next = [...e];
      const temp = next[i];
      next[i] = next[i + 1];
      next[i + 1] = temp;
      return next;
    });
    // Shift expanded index states matching their swap
    setExpandedIdxs(prev => prev.map(idx => {
      if (idx === i) return i + 1;
      if (idx === i + 1) return i;
      return idx;
    }));
  };

  return (
    <div className="adm-tab-panel" ref={scrollRef}>
      <div className="adm-main-header" style={{ padding: '0 0 1rem 0', background: 'transparent', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', width: '100%' }}>
        <h3 className="adm-panel-title">
          <FaGraduationCap style={{ marginRight: '10px', color: 'var(--adm-accent-red)' }} /> 
          Education & Timeline
        </h3>
        
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button 
            className="adm-add-btn" 
            onClick={expandAll} 
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.55rem 1rem' }}
          >
            <FaExpand style={{ fontSize: '0.75rem' }} /> Expand All
          </button>
          <button 
            className="adm-add-btn" 
            onClick={collapseAll} 
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0.55rem 1rem' }}
          >
            <FaCompress style={{ fontSize: '0.75rem' }} /> Collapse All
          </button>
          <button 
            className="adm-add-btn adm-add-block" 
            onClick={add} 
            style={{ padding: '0.55rem 1.25rem', margin: 0 }}
          >
            <FaPlus style={{ marginRight: '6px' }} /> Add Entry
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', marginTop: '0.5rem' }}>
        {edu.map((item, i) => {
          const isExpanded = expandedIdxs.includes(i);
          return (
            <div 
              key={i} 
              className="adm-card-row" 
              style={{ 
                padding: '0', 
                overflow: 'hidden', 
                border: isExpanded ? '1px solid rgba(244, 63, 94, 0.2)' : '1px solid var(--adm-border)' 
              }}
            >
              {/* ACCORDION TRIGGER HEADER */}
              <div 
                onClick={() => toggleExpand(i)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.1rem 1.5rem',
                  background: isExpanded ? 'rgba(244, 63, 94, 0.04)' : 'rgba(255,255,255,0.01)',
                  cursor: 'pointer',
                  borderBottom: isExpanded ? '1px solid var(--adm-border)' : 'none',
                  transition: 'all 0.3s ease',
                  userSelect: 'none'
                }}
                className="adm-accordion-header"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                  <span 
                    className="adm-timeline-dot-preview"
                    style={{
                      display: 'inline-block',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: getDotColorHex(item.dotColor),
                      boxShadow: `0 0 10px ${getDotColorHex(item.dotColor)}`,
                      flexShrink: 0
                    }}
                  ></span>
                  
                  <span 
                    style={{ 
                      fontWeight: 700, 
                      fontSize: '0.98rem', 
                      color: isExpanded ? 'var(--adm-accent-red-light)' : '#fff',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {item.year ? `${item.year} | ` : ''}{item.title || 'Untitled Entry'}
                  </span>
                </div>

                {/* CONTROLLER TOOLBAR */}
                <div 
                  style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }} 
                  onClick={(e) => e.stopPropagation()} // Stop event bubbling so collapse isn't toggled by clicking buttons
                >
                  <button 
                    className="adm-add-btn" 
                    onClick={() => moveUp(i)} 
                    disabled={i === 0}
                    title="Move Up"
                    style={{ padding: '0.35rem 0.55rem', opacity: i === 0 ? 0.3 : 1 }}
                  >
                    <FaArrowUp />
                  </button>
                  <button 
                    className="adm-add-btn" 
                    onClick={() => moveDown(i)} 
                    disabled={i === edu.length - 1}
                    title="Move Down"
                    style={{ padding: '0.35rem 0.55rem', opacity: i === edu.length - 1 ? 0.3 : 1 }}
                  >
                    <FaArrowDown />
                  </button>
                  <button 
                    className="adm-del-btn" 
                    onClick={() => remove(i)}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0.35rem 0.65rem' }}
                  >
                    <FaTrash style={{ fontSize: '0.72rem' }} /> Delete
                  </button>
                  
                  <div 
                    onClick={() => toggleExpand(i)}
                    style={{ 
                      marginLeft: '0.5rem', 
                      color: 'var(--adm-text-dark)', 
                      display: 'flex', 
                      alignItems: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                </div>
              </div>

              {/* COLLAPSIBLE FORM CONTAINER */}
              {isExpanded && (
                <div className="adm-modal-content" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div className="adm-grid-2">
                    <Field label="Year / Date" value={item.year} onChange={(v) => update(i, 'year', v)} />
                    <div className="adm-field">
                      <label className="adm-label">Dot Color Accent</label>
                      <select className="adm-select" value={item.dotColor} onChange={(e) => update(i, 'dotColor', e.target.value)}>
                        <option value="orange">Gold (Bright)</option>
                        <option value="blue">Red-Light (Amber)</option>
                        <option value="red">Red (Crimson)</option>
                        <option value="cyan">Gold-Light (Vanilla)</option>
                      </select>
                    </div>
                  </div>

                  <Field label="Title / Institution" value={item.title} onChange={(v) => update(i, 'title', v)} />
                  <Field label="Description & Major Achievements" value={item.description} onChange={(v) => update(i, 'description', v)} textarea />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
