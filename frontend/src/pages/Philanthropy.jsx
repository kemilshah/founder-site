import { useSeo } from '../lib/useSeo.js';
import { useCmsPage, useCmsList } from '../lib/useCms.js';
import { getPhilanthropyInitiatives, mediaUrl } from '../lib/cms.js';
import Ledger from '../components/Ledger.jsx';

const FALLBACK = {
  eyebrow: 'Philanthropy',
  heading: 'Giving back to [CONTENT TO BE PROVIDED — cause area].',
  ledgerStats: [
    { value: '[00]', label: 'Causes Supported' },
    { value: '[00]', label: 'Years Involved' },
    { value: '[00]', label: 'Partner Organizations' },
  ],
  seoTitle: 'Philanthropy — Harsh Patel',
  seoDescription: '[CONTENT TO BE PROVIDED — philanthropy page meta description]',
};

const FALLBACK_INITIATIVES = [1, 2, 3].map((n) => ({
  id: n,
  name: `[CONTENT TO BE PROVIDED — Initiative ${n}]`,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.',
}));

export default function Philanthropy() {
  const content = useCmsPage('philanthropy', FALLBACK);
  const initiatives = useCmsList(getPhilanthropyInitiatives, FALLBACK_INITIATIVES);

  useSeo({ title: content.seoTitle, description: content.seoDescription });

  return (
    <div>
      <section className="section">
        <div className="container">
          <div className="eyebrow">{content.eyebrow}</div>
          <h1 style={{ marginTop: 16, maxWidth: 800 }}>{content.heading}</h1>
          <Ledger items={content.ledgerStats} />
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <div className="grid-3">
            {initiatives.map((i) => (
              <div className="card" key={i.id}>
                {mediaUrl(i.image) ? (
                  <img src={mediaUrl(i.image)} alt={i.name} className="figure wide" style={{ objectFit: 'cover' }} />
                ) : (
                  <div className="figure wide">[INITIATIVE IMAGE]</div>
                )}
                <h3 style={{ marginTop: 20 }}>{i.name}</h3>
                <p style={{ marginTop: 8 }}>{i.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
