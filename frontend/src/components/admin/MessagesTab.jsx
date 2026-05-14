import React, { useState, useEffect } from 'react';
import { FaRegEnvelopeOpen, FaPlus, FaCheck, FaTrash } from 'react-icons/fa';

export default function MessagesTab() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const baseUrl = 'https://port-folio-backend-file.vercel.app';
    try {
      const res = await fetch(`${baseUrl}/api/messages`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
      });
      if (res.ok) setMessages(await res.json());
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id) => {
    const baseUrl = 'https://port-folio-backend-file.vercel.app';
    await fetch(`${baseUrl}/api/messages/${id}/read`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
    });
    setMessages(messages.map(m => m._id === id ? { ...m, read: true } : m));
  };

  const deleteMsg = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    const baseUrl = 'https://port-folio-backend-file.vercel.app';
    await fetch(`${baseUrl}/api/messages/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
    });
    setMessages(messages.filter(m => m._id !== id));
  };

  if (loading) return <div>Loading messages...</div>;

  return (
    <div className="adm-tab-panel">
      <div className="adm-panel-header">
        <h3 className="adm-panel-title"><FaRegEnvelopeOpen style={{marginRight: '10px'}} /> Messages</h3>
        <button className="adm-upload-btn" onClick={fetchMessages}><FaPlus style={{marginRight: '6px'}} /> Refresh</button>
      </div>
      {messages.length === 0 ? (
        <p style={{ color: '#6B6880' }}>No messages yet.</p>
      ) : (
        <div className="adm-grid-2" style={{ alignItems: 'start' }}>
          {messages.map(m => (
            <div key={m._id} className="adm-card-row" style={{ opacity: m.read ? 0.6 : 1, transition: 'opacity 0.2s' }}>
              <div className="adm-card-row-header">
                <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: m.read ? '#9ca3af' : '#fff' }}>{m.name}</span>
                <span style={{ fontSize: '0.8rem', color: '#6B6880' }}>{new Date(m.createdAt).toLocaleString()}</span>
              </div>
              <div style={{ color: '#f87171', fontSize: '0.9rem' }}>{m.email}</div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', marginTop: '0.5rem', whiteSpace: 'pre-wrap' }}>
                {m.message}
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                {!m.read && <button className="adm-add-btn" onClick={() => markRead(m._id)}><FaCheck style={{marginRight: '6px'}} /> Mark Read</button>}
                <button className="adm-del-btn" onClick={() => deleteMsg(m._id)}><FaTrash style={{marginRight: '6px'}} /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
