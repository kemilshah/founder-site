import { useSeo } from '../lib/useSeo.js';
import { useCmsPage, useCmsList } from '../lib/useCms.js';
import { getPressItems, mediaUrl } from '../lib/cms.js';

const FALLBACK = {
  eyebrow: 'Media & Press',
  heading: 'Interviews, features, and coverage.',
  secondaryHeading: 'Media Kit',
  secondaryBody: 'Approved headshots, bio, and press assets available on request.',
  seoTitle: 'Media & Press — Kemil Shah',
  seoDescription: '[CONTENT TO BE PROVIDED — media page meta description]',
};

const FALLBACK_PRESS = [1, 2, 3, 4, 5, 6].map((n) => ({
  id: n,
  title: `[CONTENT TO BE PROVIDED — Article / Interview Title ${n}]`,
  publication: '[Publication Name]',
  year: '[YYYY]',
  url: '#',
}));

export default function Media() {
  const content = useCmsPage('media', FALLBACK);
  const press = useCmsList(getPressItems, FALLBACK_PRESS);

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
        <div className="container">
          <div className="grid-3">
            {press.map((p) => (
              <div className="card" key={p.id}>
                {mediaUrl(p.thumbnail) ? (
                  <img src={mediaUrl(p.thumbnail)} alt={p.title} className="figure wide" style={{ objectFit: 'cover' }} />
                ) : (
                  <div className="figure wide">[PUBLICATION LOGO / THUMBNAIL]</div>
                )}
                <div className="eyebrow" style={{ marginTop: 16 }}>{p.publication} — {p.year}</div>
                <h3 style={{ marginTop: 8 }}>{p.title}</h3>
                <a href={p.url || '#'} className="btn" style={{ marginTop: 16 }}>
                  Read Feature
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight dark">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2>{content.secondaryHeading}</h2>
          <p style={{ marginTop: 16, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
            {content.secondaryBody}
          </p>
          <a href="#" className="btn btn-solid" style={{ marginTop: 24 }}>
            Download Media Kit (PDF)
          </a>
        </div>
      </section>
    </div>
  );
}
