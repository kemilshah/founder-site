import { Link } from 'react-router-dom';
import Ledger from '../components/Ledger.jsx';
import { useSeo } from '../lib/useSeo.js';
import { useCmsPage, useCmsList } from '../lib/useCms.js';
import { getVentures, mediaUrl } from '../lib/cms.js';

const FALLBACK = {
  eyebrow: 'Founder — Investor — Operator',
  heading: 'Building ventures that [CONTENT TO BE PROVIDED — founder mission statement].',
  intro:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  secondaryHeading: 'Lorem ipsum dolor sit amet consectetur.',
  secondaryBody:
    'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
  ledgerStats: [
    { value: '[00]', label: 'Ventures Founded' },
    { value: '[00]', label: 'Years Operating' },
    { value: '[00]', label: 'Countries' },
    { value: '[00]', label: 'Press Features' },
  ],
  seoTitle: 'Harsh Patel — Founder, Investor, Operator',
  seoDescription: '[CONTENT TO BE PROVIDED — home page meta description]',
};

const FALLBACK_VENTURES = [1, 2, 3].map((n) => ({
  id: n,
  name: `[CONTENT TO BE PROVIDED — Venture ${n}]`,
  summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
}));

export default function Home() {
  const content = useCmsPage('home', FALLBACK);
  const ventures = useCmsList(getVentures, FALLBACK_VENTURES).slice(0, 3);

  useSeo({ title: content.seoTitle, description: content.seoDescription });

  return (
    <div>
      <section className="hero">
        <div className="container">
          <div className="eyebrow">{content.eyebrow}</div>
          <div className="hero-grid" style={{ marginTop: 20 }}>
            <h1>{content.heading}</h1>
            <p>{content.intro}</p>
          </div>
          <Ledger items={content.ledgerStats} />
        </div>
      </section>

      <section className="section dark">
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center' }}>
            <div className="figure">[FOUNDER PORTRAIT]</div>
            <div>
              <div className="eyebrow">The Story</div>
              <h2 style={{ marginTop: 16 }}>{content.secondaryHeading}</h2>
              <p style={{ marginTop: 20 }}>{content.secondaryBody}</p>
              <Link to="/about" className="btn" style={{ marginTop: 28 }}>
                Read the Full Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="eyebrow">Business Ventures</div>
          <h2 style={{ marginTop: 16, marginBottom: 48 }}>Selected Ventures</h2>
          <div className="grid-3">
            {ventures.map((v) => (
              <div className="card" key={v.id}>
                {mediaUrl(v.logo) ? (
                  <img src={mediaUrl(v.logo)} alt={v.name} className="figure wide" style={{ objectFit: 'cover' }} />
                ) : (
                  <div className="figure wide">[VENTURE LOGO / IMAGE]</div>
                )}
                <h3 style={{ marginTop: 20 }}>{v.name}</h3>
                <p style={{ marginTop: 8 }}>{v.summary}</p>
              </div>
            ))}
          </div>
          <Link to="/ventures" className="btn" style={{ marginTop: 48 }}>
            View All Ventures
          </Link>
        </div>
      </section>

      <section className="section-tight dark">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2>Available for select speaking engagements and press.</h2>
          <div style={{ marginTop: 32, display: 'flex', gap: 16, justifyContent: 'center' }}>
            <Link to="/speaking" className="btn btn-solid">Speaking Inquiries</Link>
            <Link to="/contact" className="btn">Contact</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
