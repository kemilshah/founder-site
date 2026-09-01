import { useEffect } from 'react';

/**
 * Minimal per-page SEO. No extra dependency (react-helmet) needed for a
 * client-rendered SPA of this size — sets document.title and the meta
 * description tag on mount. If the project later moves to Next.js SSR
 * (see spec Section 77), replace this with next/head or the metadata API.
 */
export function useSeo({ title, description }) {
  useEffect(() => {
    if (title) document.title = title;

    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', 'description');
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', description);
    }
  }, [title, description]);
}
