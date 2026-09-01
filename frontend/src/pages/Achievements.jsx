import Ledger from '../components/Ledger.jsx';
import { useSeo } from '../lib/useSeo.js';
import { useCmsPage, useCmsList } from '../lib/useCms.js';
import { getAchievements } from '../lib/cms.js';

const FALLBACK = {
  eyebrow: 'Achievements',
  heading: 'Recognition, awards, and milestones.',
  ledgerStats: [
    { value: '[00]', label: 'Awards' },
    { value: '[00]', label: 'Exits' },
    { value: '[00]', label: 'Board Seats' },
    { value: '[00]', label: 'Publications' },
  ],
  seoTitle: 'Achievements — Harsh Patel',
  seoDescription: '[CONTENT TO BE PROVIDED — achievements page meta description]',
};

const FALLBACK_ACHIEVEMENTS = [1, 2, 3, 4].map((n) => ({
  id: n,
  year: '[YYYY]',
  title: `[CONTENT TO BE PROVIDED — Award / Milestone ${n}]`,
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
}));

export default function Achievements() {
  const content = useCmsPage('achievements', FALLBACK);
  const achievements = useCmsList(getAchievements, FALLBACK_ACHIEVEMENTS);

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

      <section className="section-tight dark">
        <div className="container">
          <div className="grid-2">
            {achievements.map((a) => (
              <div className="card" key={a.id}>
                <div className="eyebrow">{a.year}</div>
                <h3 style={{ marginTop: 8 }}>{a.title}</h3>
                <p style={{ marginTop: 8 }}>{a.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
