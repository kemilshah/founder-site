import { useState, useEffect } from 'react';
import { useSeo } from '../lib/useSeo.js';
import { useCmsPage } from '../lib/useCms.js';
import { getSiteSettings } from '../lib/cms.js';

const FALLBACK = {
  eyebrow: 'Contact',
  heading: 'Get in touch.',
  intro: 'For business inquiries, press, or general questions — lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  seoTitle: 'Contact — Kemil Shah',
  seoDescription: '[CONTENT TO BE PROVIDED — contact page meta description]',
};

const SETTINGS_FALLBACK = {
  email: '[CONTENT TO BE PROVIDED — email address]',
  location: '[CONTENT TO BE PROVIDED — city / region]',
  socialLinksNote: '[CONTENT TO BE PROVIDED — social links]',
};

export default function Contact() {
  const content = useCmsPage('contact', FALLBACK);
  const [settings, setSettings] = useState(SETTINGS_FALLBACK);

  useEffect(() => {
    let cancelled = false;
    getSiteSettings()
      .then((s) => {
        if (!cancelled && s) setSettings({ ...SETTINGS_FALLBACK, ...s });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useSeo({ title: content.seoTitle, description: content.seoDescription });

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', company: '' });
  const [status, setStatus] = useState(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('failed');
      setStatus('ok');
      setForm({ name: '', email: '', subject: '', message: '', company: '' });
    } catch {
      setStatus('err');
    }
  };

  return (
    <div>
      <section className="section">
        <div className="container">
          <div className="eyebrow">{content.eyebrow}</div>
          <h1 style={{ marginTop: 16, maxWidth: 700 }}>{content.heading}</h1>
          <p style={{ marginTop: 16, maxWidth: 560 }}>{content.intro}</p>
        </div>
      </section>

      <section className="section-tight">
        <div className="container grid-2">
          <form onSubmit={onSubmit}>
            <input
              type="text"
              name="company"
              value={form.company}
              onChange={onChange}
              tabIndex={-1}
              autoComplete="off"
              style={{ position: 'absolute', left: '-9999px', width: 1, height: 1 }}
              aria-hidden="true"
            />
            <div className="field">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" value={form.name} onChange={onChange} required />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" value={form.email} onChange={onChange} required />
            </div>
            <div className="field">
              <label htmlFor="subject">Subject</label>
              <select id="subject" name="subject" value={form.subject} onChange={onChange} required>
                <option value="">Select one</option>
                <option value="business">Business Opportunity</option>
                <option value="press">Press / Media</option>
                <option value="general">General Inquiry</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" value={form.message} onChange={onChange} required />
            </div>
            <button className="btn btn-solid" type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Send Message'}
            </button>
            {status === 'ok' && <p className="status-msg ok">Message sent. Thank you for reaching out.</p>}
            {status === 'err' && <p className="status-msg err">Something went wrong. Please try again.</p>}
          </form>

          <div>
            <div className="eyebrow">Direct</div>
            <p style={{ marginTop: 12 }}>{settings.email}</p>
            <div className="eyebrow" style={{ marginTop: 32 }}>Location</div>
            <p style={{ marginTop: 12 }}>{settings.location}</p>
            <div className="eyebrow" style={{ marginTop: 32 }}>Social</div>
            <p style={{ marginTop: 12 }}>{settings.socialLinksNote}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
