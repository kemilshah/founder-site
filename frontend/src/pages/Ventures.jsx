import { useSeo } from '../lib/useSeo.js';
import { useCmsPage, useCmsList } from '../lib/useCms.js';
import { getVentures, mediaUrl } from '../lib/cms.js';

const FALLBACK = {
  eyebrow: 'Business Ventures',
  heading: 'A portfolio of companies across [CONTENT TO BE PROVIDED — industries].',
  seoTitle: 'Business Ventures — Kemil Shah',
  seoDescription: '[CONTENT TO BE PROVIDED — ventures page meta description]',
};

const FALLBACK_VENTURES = [1, 2, 3, 4, 5, 6].map((n) => ({
  id: n,
  name: `[CONTENT TO BE PROVIDED — Venture ${n} Name]`,
  industry: '[Industry]',
  stage: '[Stage]',
  summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.',
  url: '#',
}));

export default function Ventures() {
  const content = useCmsPage('ventures', FALLBACK);
  const ventures = useCmsList(getVentures, FALLBACK_VENTURES);

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
            {ventures.map((v) => (
              <div className="card" key={v.id}>
                {mediaUrl(v.logo) ? (
                  <img src={mediaUrl(v.logo)} alt={v.name} className="figure wide" style={{ objectFit: 'cover' }} />
                ) : (
                  <div className="figure wide">[VENTURE LOGO]</div>
                )}
                {v.industry && <div className="tag">{v.industry}</div>}
                {v.stage && <div className="tag">{v.stage}</div>}
                <h3 style={{ marginTop: 16 }}>{v.name}</h3>
                <p style={{ marginTop: 8 }}>{v.summary}</p>
                <a href={v.url || '#'} className="btn" style={{ marginTop: 16 }}>
                  View Venture
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
