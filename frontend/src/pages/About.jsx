import { useSeo } from '../lib/useSeo.js';
import { useCmsPage, useCmsList } from '../lib/useCms.js';
import { getTimelineEntries, getValues, mediaUrl } from '../lib/cms.js';

const FALLBACK = {
  eyebrow: 'About',
  heading: 'Lorem ipsum dolor sit amet consectetur adipiscing.',
  intro:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  seoTitle: 'About — Kemil Shah',
  seoDescription: '[CONTENT TO BE PROVIDED — about page meta description]',
};

const FALLBACK_TIMELINE = [1, 2, 3, 4].map((n) => ({
  id: n,
  year: '[YYYY]',
  title: '[CONTENT TO BE PROVIDED — milestone]',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.',
}));

const FALLBACK_VALUES = [1, 2, 3].map((n) => ({
  id: n,
  title: `[VALUE ${n}]`,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
}));

export default function About() {
  const content = useCmsPage('about', FALLBACK);
  const timeline = useCmsList(getTimelineEntries, FALLBACK_TIMELINE);
  const values = useCmsList(getValues, FALLBACK_VALUES);

  useSeo({ title: content.seoTitle, description: content.seoDescription });

  return (
    <div>
      <section className="section">
        <div className="container">
          <div className="eyebrow">{content.eyebrow}</div>
          <h1 style={{ marginTop: 16, maxWidth: 800 }}>{content.heading}</h1>
        </div>
      </section>

      <section className="section-tight">
        <div className="container grid-2">
          {mediaUrl(content.pageImage) ? (
            <img src={mediaUrl(content.pageImage)} alt="Kemil Shah" className="figure" style={{ objectFit: 'cover' }} />
          ) : (
            <div className="figure">[FOUNDER PORTRAIT — EDITORIAL]</div>
          )}
          <div>
            <p>{content.intro}</p>
          </div>
        </div>
      </section>

      <section className="section dark">
        <div className="container">
          <div className="eyebrow">Career Journey</div>
          <h2 style={{ marginTop: 16, marginBottom: 56 }}>Timeline</h2>
          <div className="timeline">
            {timeline.map((t) => (
              <div className="timeline-item" key={t.id}>
                <div className="timeline-folio">{t.year}</div>
                <h3>{t.title}</h3>
                <p style={{ marginTop: 8, maxWidth: 560 }}>{t.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="eyebrow">Values &amp; Philosophy</div>
          <h2 style={{ marginTop: 16, marginBottom: 40 }}>What Drives the Work</h2>
          <div className="grid-3">
            {values.map((v) => (
              <div className="card" key={v.id}>
                <h3>{v.title}</h3>
                <p style={{ marginTop: 8 }}>{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
