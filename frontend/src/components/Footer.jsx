import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSiteLinks, getSiteSettings } from '../lib/cms.js';

const FALLBACK_LINKS = [
  { id: 'about', label: 'About', url: '/about' },
  { id: 'media', label: 'Media Kit', url: '/media' },
  { id: 'contact', label: 'Contact', url: '/contact' },
];

const FALLBACK_SETTINGS = {
  wordmark: 'Harsh Patel',
  footerBlurb: '[CONTENT TO BE PROVIDED — one-line founder positioning statement]',
  email: '[CONTENT TO BE PROVIDED — email]',
  socialLinksNote: '[CONTENT TO BE PROVIDED — social / press URLs]',
};

export default function Footer() {
  const [links, setLinks] = useState(FALLBACK_LINKS);
  const [settings, setSettings] = useState(FALLBACK_SETTINGS);

  useEffect(() => {
    let cancelled = false;
    getSiteLinks()
      .then((rows) => {
        if (!cancelled && Array.isArray(rows) && rows.length > 0) {
          const footer = rows.filter((r) => r.placement === 'footer');
          if (footer.length > 0) setLinks(footer);
        }
      })
      .catch(() => {});
    getSiteSettings()
      .then((s) => {
        if (!cancelled && s) setSettings({ ...FALLBACK_SETTINGS, ...s });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <footer className="footer dark">
      <div className="container footer-grid">
        <div>
          <div className="wordmark" style={{ marginBottom: 12 }}>{settings.wordmark}</div>
          <p style={{ maxWidth: 320 }}>{settings.footerBlurb}</p>
        </div>
        <div>
          <div className="eyebrow" style={{ marginBottom: 12 }}>Connect</div>
          <p>{settings.socialLinksNote}</p>
        </div>
        <div>
          <div className="eyebrow" style={{ marginBottom: 12 }}>Inquiries</div>
          <p>{settings.email}</p>
          <nav style={{ marginTop: 16, display: 'flex', gap: 16 }}>
            {links.map((l) => (
              <Link key={l.id} to={l.url} style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className="container" style={{ marginTop: 48 }}>
        <hr className="hr" />
        <p style={{ marginTop: 16, fontSize: 12, fontFamily: 'var(--mono)' }}>
          © {new Date().getFullYear()} {settings.wordmark}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
