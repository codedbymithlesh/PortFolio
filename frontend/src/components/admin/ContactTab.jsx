import React, { useState } from 'react';
import { FaEnvelope } from 'react-icons/fa';
import { Field, useSave } from './AdminCommon';

export default function ContactTab({ portfolio, updatePortfolio, setGlobalSave }) {
  const [contact, setContact] = useState({ ...portfolio.contact });
  const isDirty = JSON.stringify(contact) !== JSON.stringify(portfolio.contact);
  const [status, save] = useSave('contact', contact, updatePortfolio, setGlobalSave, isDirty);
  const set = (k) => (v) => setContact((c) => ({ ...c, [k]: v }));

  return (
    <div className="adm-tab-panel">
      <div className="adm-panel-header">
        <h3 className="adm-panel-title"><FaEnvelope style={{marginRight: '10px'}} /> Contact Info</h3>
      </div>
      <div className="adm-grid-2">
        <Field label="Email Address" value={contact.email} onChange={set('email')} type="email" />
        <Field label="Location" value={contact.location} onChange={set('location')} />
        <Field label="GitHub URL" value={contact.github} onChange={set('github')} />
        <Field label="LinkedIn URL" value={contact.linkedin} onChange={set('linkedin')} />
        <Field label="YouTube URL" value={contact.youtube} onChange={set('youtube')} />
      </div>
    </div>
  );
}
