import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { getSiteLinks, getSiteSettings } from '../lib/cms.js';

const FALLBACK_LINKS = [
  { id: 'home', label: 'Home', url: '/' },
  { id: 'about', label: 'About', url: '/about' },
  { id: 'ventures', label: 'Business Ventures', url: '/ventures' },
  { id: 'achievements', label: 'Achievements', url: '/achievements' },
  { id: 'media', label: 'Media & Press', url: '/media' },
  { id: 'lifestyle', label: 'Lifestyle', url: '/lifestyle' },
  { id: 'philanthropy', label: 'Philanthropy', url: '/philanthropy' },
  { id: 'speaking', label: 'Speaking', url: '/speaking' },
  { id: 'contact', label: 'Contact', url: '/contact' },
];

export default function Nav() {
  const [links, setLinks] = useState(FALLBACK_LINKS);
  const [wordmark, setWordmark] = useState('Kemil Shah');
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;
    getSiteLinks()
      .then((rows) => {
        if (!cancelled && Array.isArray(rows) && rows.length > 0) {
          const header = rows.filter((r) => r.placement === 'header');
          if (header.length > 0) setLinks(header);
        }
      })
      .catch(() => {});
    getSiteSettings()
      .then((s) => {
        if (!cancelled && s?.wordmark) setWordmark(s.wordmark);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Close the mobile menu on route change, and stop background scroll
  // while it's open.
  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="nav">
      <div className="nav-inner">
        <NavLink to="/" className="wordmark">{wordmark}</NavLink>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="primary-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`nav-toggle-bars ${open ? 'is-open' : ''}`} aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        <nav id="primary-nav">
          <ul className={`nav-links ${open ? 'is-open' : ''}`}>
            {links.map((l) => (
              <li key={l.id}>
                <NavLink
                  to={l.url}
                  end={l.url === '/'}
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  target={l.openInNewTab ? '_blank' : undefined}
                  rel={l.openInNewTab ? 'noopener noreferrer' : undefined}
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
