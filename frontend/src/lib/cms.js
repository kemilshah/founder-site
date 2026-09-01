const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

/**
 * Thin fetch wrapper around the Strapi REST API. Throws on non-2xx so
 * callers can catch and fall back to placeholder content — the CMS being
 * down should degrade the site, not blank-page it.
 */
async function strapiFetch(path) {
  const res = await fetch(`${STRAPI_URL}/api${path}`);
  if (!res.ok) throw new Error(`Strapi request failed: ${path} (${res.status})`);
  const json = await res.json();
  return json.data;
}

export function getPage(slug) {
  return strapiFetch(`/pages?filters[slug][$eq]=${encodeURIComponent(slug)}`).then(
    (rows) => rows?.[0] ?? null
  );
}

export function getSiteSettings() {
  return strapiFetch('/site-setting');
}

export function getSiteLinks() {
  return strapiFetch('/site-links?sort=order:asc');
}

export function getVentures() {
  return strapiFetch('/ventures?sort=order:asc&populate=logo');
}

export function getAchievements() {
  return strapiFetch('/achievements?sort=order:asc');
}

export function getPressItems() {
  return strapiFetch('/press-items?sort=order:asc&populate=thumbnail');
}

export function getLifestyleImages() {
  return strapiFetch('/lifestyle-images?sort=order:asc&populate=image');
}

export function getPhilanthropyInitiatives() {
  return strapiFetch('/philanthropy-initiatives?sort=order:asc&populate=image');
}

export function getTimelineEntries() {
  return strapiFetch('/timeline-entries?sort=order:asc');
}

export function getValues() {
  return strapiFetch('/values?sort=order:asc');
}

export function getSpeakingTopics() {
  return strapiFetch('/speaking-topics?sort=order:asc');
}

export function getPastEngagements() {
  return strapiFetch('/past-engagements?sort=order:asc');
}

/** Resolve a Strapi media object (from a populated field) to an absolute URL. */
export function mediaUrl(media) {
  if (!media) return null;
  const url = media.url || media.data?.attributes?.url;
  if (!url) return null;
  return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
}
