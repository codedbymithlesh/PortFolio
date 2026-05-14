import React, { useState } from 'react';
import { FaBriefcase, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useSave } from './AdminCommon';
import ProjectModal from './ProjectModal';

export default function ProjectsTab({ portfolio, updatePortfolio, setGlobalSave }) {
  const [projects, setProjects] = useState(portfolio.projects.map((p) => ({ ...p, tech: [...(p.tech || [])] })));
  const isDirty = JSON.stringify(projects) !== JSON.stringify(portfolio.projects);
  const [status, save] = useSave('projects', projects, updatePortfolio, setGlobalSave, isDirty);
  
  const [editingIdx, setEditingIdx] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleSaveProject = (updatedProj) => {
    const next = [...projects];
    if (isAdding) {
      next.push(updatedProj);
    } else {
      next[editingIdx] = updatedProj;
    }
    setProjects(next);
    setIsAdding(false);
    setEditingIdx(null);
  };

  const remove = (i) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    setProjects((p) => p.filter((_, idx) => idx !== i));
  };

  return (
    <div className="adm-tab-panel">
      <div className="adm-panel-header">
        <h3 className="adm-panel-title"><FaBriefcase style={{marginRight: '10px'}} /> Featured Projects</h3>
        <button className="adm-add-btn" onClick={() => setIsAdding(true)}><FaPlus style={{marginRight: '6px'}} /> Add Project</button>
      </div>

      <div className="adm-projects-grid">
        {[...projects].reverse().map((proj, reversedIdx) => {
          const i = projects.length - 1 - reversedIdx;
          return (
            <div key={i} className="adm-project-card-mini">
              <div className="adm-project-thumb">
                {proj.previewImage ? (
                  <img src={proj.previewImage} alt={proj.title} />
                ) : (
                  <div className="adm-no-thumb">No Image</div>
                )}
              </div>
              <div className="adm-project-info">
                <h4>{proj.title || 'Untitled Project'}</h4>
                <p>{proj.description?.substring(0, 60)}...</p>
                <div className="adm-project-actions">
                  <button className="adm-icon-btn edit" onClick={() => setEditingIdx(i)}><FaEdit /> Edit</button>
                  <button className="adm-icon-btn del" onClick={() => remove(i)}><FaTrash /> Delete</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {(editingIdx !== null || isAdding) && (
        <ProjectModal 
          project={isAdding ? { title: '', tech: [], description: '', link: '#', previewImage: '' } : projects[editingIdx]} 
          onSave={handleSaveProject} 
          onClose={() => { setEditingIdx(null); setIsAdding(false); }} 
        />
      )}
    </div>
  );
}
