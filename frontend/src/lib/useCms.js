import { useEffect, useState } from 'react';
import { getPage } from './cms.js';

/**
 * Fetches a Page entry by slug. Starts with `fallback` (the Lorem ipsum
 * defaults) so the page renders immediately, then swaps in real CMS
 * content once it arrives. If the CMS is unreachable or the page hasn't
 * been created yet, it silently keeps the fallback — the site should
 * never blank-page just because the CMS is down.
 */
export function useCmsPage(slug, fallback) {
  const [content, setContent] = useState(fallback);

  useEffect(() => {
    let cancelled = false;
    getPage(slug)
      .then((page) => {
        if (!cancelled && page) {
          setContent({ ...fallback, ...stripEmpty(page) });
        }
      })
      .catch(() => {
        // CMS unreachable — keep the fallback content, no error shown.
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return content;
}

/**
 * Fetches a list from the CMS (ventures, achievements, press, etc).
 * Returns `fallback` until real data loads or the request fails.
 */
export function useCmsList(fetcher, fallback) {
  const [items, setItems] = useState(fallback);

  useEffect(() => {
    let cancelled = false;
    fetcher()
      .then((rows) => {
        if (!cancelled && Array.isArray(rows) && rows.length > 0) {
          setItems(rows);
        }
      })
      .catch(() => {
        // CMS unreachable — keep the fallback list.
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return items;
}

// Strip null/undefined so spreading CMS content over fallback doesn't
// clobber a good fallback string with an empty CMS field.
function stripEmpty(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== null && v !== undefined && v !== '') out[k] = v;
  }
  return out;
}
