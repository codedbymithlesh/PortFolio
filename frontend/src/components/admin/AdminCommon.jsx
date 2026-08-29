import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FaSave, FaHourglassHalf, FaCheck, FaTimes } from 'react-icons/fa';

/* ── Tiny reusable field ── */
export const Field = ({ label, value, onChange, textarea, type = 'text' }) => (
  <div className="adm-field">
    <label className="adm-label">{label}</label>
    {textarea
      ? <textarea className="adm-input adm-textarea" value={value} onChange={(e) => onChange(e.target.value)} rows={4} />
      : <input type={type} className="adm-input" value={value} onChange={(e) => onChange(e.target.value)} />}
  </div>
);

/* ── Save button with feedback ── */
export const SaveBtn = ({ onClick, status, isDirty }) => (
  <button className={`adm-save-btn ${status} ${isDirty && !status ? 'dirty' : ''}`} onClick={onClick} disabled={status === 'saving'}>
    {status === 'saving' ? <><FaHourglassHalf style={{marginRight: '6px'}} /> Saving...</> : status === 'ok' ? <><FaCheck style={{marginRight: '6px'}} /> Saved!</> : status === 'err' ? <><FaTimes style={{marginRight: '6px'}} /> Error</> : <><FaSave style={{marginRight: '6px'}} /> Save Changes {isDirty && <span className="adm-dirty-dot"></span>}</>}
  </button>
);

export function useSave(section, value, updatePortfolio, setGlobalSave, isDirty) {
  const [status, setStatus] = useState('');
  const savingRef = useRef(false);
  const valueRef = useRef(value);
  valueRef.current = value;

  const save = useCallback(async () => {
    if (savingRef.current) return false;
    savingRef.current = true;
    setStatus('saving');
    try {
      const ok = await updatePortfolio(section, valueRef.current);
      setStatus(ok ? 'ok' : 'err');
      setTimeout(() => setStatus(''), 2500);
      return ok;
    } catch (err) {
      console.error('Save error:', err);
      setStatus('err');
      setTimeout(() => setStatus(''), 2500);
      return false;
    } finally {
      savingRef.current = false;
    }
  }, [section, updatePortfolio]);

  useEffect(() => {
    if (setGlobalSave) {
      setGlobalSave(save, status, isDirty);
    }
  }, [save, status, setGlobalSave, isDirty]);

  return [status, save];
}
