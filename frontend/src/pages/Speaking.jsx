import { useState } from 'react';
import { useSeo } from '../lib/useSeo.js';
import { useCmsPage, useCmsList } from '../lib/useCms.js';
import { getSpeakingTopics, getPastEngagements } from '../lib/cms.js';

const FALLBACK = {
  eyebrow: 'Speaking & Events',
  heading: 'Available for keynotes, panels, and fireside chats.',
  secondaryHeading: 'Selected Stages',
  secondaryBody: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  seoTitle: 'Speaking & Events — Harsh Patel',
  seoDescription: '[CONTENT TO BE PROVIDED — speaking page meta description]',
};

const FALLBACK_TOPICS = ['[Topic One]', '[Topic Two]', '[Topic Three]', '[Topic Four]'].map((title, i) => ({ id: i, title }));
const FALLBACK_ENGAGEMENTS = [1, 2, 3].map((n) => ({ id: n, eventName: `[CONTENT TO BE PROVIDED — Event / Conference ${n}]`, year: '[YYYY]' }));

export default function Speaking() {
  const content = useCmsPage('speaking', FALLBACK);
  const topics = useCmsList(getSpeakingTopics, FALLBACK_TOPICS);
  const engagements = useCmsList(getPastEngagements, FALLBACK_ENGAGEMENTS);

  useSeo({ title: content.seoTitle, description: content.seoDescription });

  const [form, setForm] = useState({ name: '', organization: '', email: '', eventDate: '', message: '', company: '' });
  const [status, setStatus] = useState(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/speaking-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('failed');
      setStatus('ok');
      setForm({ name: '', organization: '', email: '', eventDate: '', message: '', company: '' });
    } catch {
      setStatus('err');
    }
  };

  return (
    <div>
      <section className="section">
        <div className="container">
          <div className="eyebrow">{content.eyebrow}</div>
          <h1 style={{ marginTop: 16, maxWidth: 800 }}>{content.heading}</h1>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <div className="eyebrow">Topics</div>
          <div style={{ marginTop: 16 }}>
            {topics.map((t) => (
              <span className="tag" key={t.id}>{t.title}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight dark">
        <div className="container">
          <div className="grid-2">
            <div>
              <div className="eyebrow">Past Engagements</div>
              <h2 style={{ marginTop: 16 }}>{content.secondaryHeading}</h2>
              <p style={{ marginTop: 16 }}>{content.secondaryBody}</p>
              <div style={{ marginTop: 24 }}>
                {engagements.map((e) => (
                  <p key={e.id} style={{ borderTop: '1px solid var(--line)', paddingTop: 12, marginTop: 12 }}>
                    {e.eventName}, {e.year}
                  </p>
                ))}
              </div>
            </div>

            <div>
              <div className="eyebrow">Inquiry Form</div>
              <h2 style={{ marginTop: 16, marginBottom: 24 }}>Request an Engagement</h2>
              <form onSubmit={onSubmit}>
                <input
                  type="text"
                  name="company_website"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
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
                  <label htmlFor="organization">Organization</label>
                  <input id="organization" name="organization" value={form.organization} onChange={onChange} required />
                </div>
                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" value={form.email} onChange={onChange} required />
                </div>
                <div className="field">
                  <label htmlFor="eventDate">Event Date</label>
                  <input id="eventDate" name="eventDate" type="date" value={form.eventDate} onChange={onChange} />
                </div>
                <div className="field">
                  <label htmlFor="message">Details</label>
                  <textarea id="message" name="message" value={form.message} onChange={onChange} required />
                </div>
                <button className="btn btn-solid" type="submit" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : 'Submit Inquiry'}
                </button>
                {status === 'ok' && <p className="status-msg ok">Inquiry received. We'll be in touch shortly.</p>}
                {status === 'err' && <p className="status-msg err">Something went wrong. Please try again or email directly.</p>}
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
