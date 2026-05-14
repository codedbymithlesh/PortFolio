import React, { useState } from 'react';
import { FaLock } from 'react-icons/fa';
import { Field } from './AdminCommon';

export default function SettingsTab() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState({ loading: false, msg: '', type: '' });

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, msg: '', type: '' });
    const baseUrl = 'https://port-folio-backend-file.vercel.app';
    try {
      const res = await fetch(`${baseUrl}/api/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ loading: false, msg: 'Password changed successfully', type: 'success' });
        setCurrentPassword('');
        setNewPassword('');
      } else {
        setStatus({ loading: false, msg: data.message, type: 'error' });
      }
    } catch {
      setStatus({ loading: false, msg: 'Network error', type: 'error' });
    }
  };

  return (
    <div className="adm-tab-panel">
      <div className="adm-panel-header">
        <h3 className="adm-panel-title"><FaLock style={{marginRight: '10px'}} /> Security Settings</h3>
      </div>
      <form onSubmit={handleChangePassword} className="adm-card-row">
        <div className="adm-grid-2">
          <Field label="Current Password" type="password" value={currentPassword} onChange={setCurrentPassword} />
          <Field label="New Password (min 8 chars)" type="password" value={newPassword} onChange={setNewPassword} />
        </div>
        <button type="submit" className="adm-save-btn" disabled={status.loading || !currentPassword || newPassword.length < 8} style={{ width: 'fit-content' }}>
          {status.loading ? 'Updating...' : 'Update Password'}
        </button>
        {status.msg && (
          <div style={{ color: status.type === 'error' ? '#ef4444' : '#10b981', marginTop: '0.5rem', fontWeight: 'bold' }}>
            {status.msg}
          </div>
        )}
      </form>
    </div>
  );
}
