'use strict';

/**
 * On first boot, grant the public role "find"/"findOne" access to every
 * content type this site needs, so the React frontend can read published
 * content without an API token. Run once per fresh database — safe to
 * leave in place; it's idempotent (only fills in missing permissions).
 */
const PUBLIC_READABLE = [
  'api::venture.venture',
  'api::achievement.achievement',
  'api::press-item.press-item',
  'api::lifestyle-image.lifestyle-image',
  'api::philanthropy-initiative.philanthropy-initiative',
  'api::timeline-entry.timeline-entry',
  'api::value.value',
  'api::speaking-topic.speaking-topic',
  'api::past-engagement.past-engagement',
  'api::site-link.site-link',
  'api::page.page',
  'api::site-setting.site-setting',
];

const ACTIONS = ['find', 'findOne'];

async function seedIfEmpty(strapi) {
  const existingPages = await strapi.db.query('api::page.page').count();
  if (existingPages > 0) return; // already seeded — never overwrite real content

  const now = new Date();
  const lorem =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

  const pages = [
    {
      slug: 'home',
      eyebrow: 'Founder — Investor — Operator',
      heading: 'Building ventures that [CONTENT TO BE PROVIDED — founder mission statement].',
      intro: lorem,
      ledgerStats: [
        { value: '[00]', label: 'Ventures Founded' },
        { value: '[00]', label: 'Years Operating' },
        { value: '[00]', label: 'Countries' },
        { value: '[00]', label: 'Press Features' },
      ],
      seoTitle: 'Kemil Shah — Founder, Investor, Operator',
      seoDescription: '[CONTENT TO BE PROVIDED — home page meta description]',
    },
    {
      slug: 'about',
      eyebrow: 'About',
      heading: 'Lorem ipsum dolor sit amet consectetur adipiscing.',
      intro: lorem,
      seoTitle: 'About — Kemil Shah',
      seoDescription: '[CONTENT TO BE PROVIDED — about page meta description]',
    },
    {
      slug: 'ventures',
      eyebrow: 'Business Ventures',
      heading: 'A portfolio of companies across [CONTENT TO BE PROVIDED — industries].',
      seoTitle: 'Business Ventures — Kemil Shah',
      seoDescription: '[CONTENT TO BE PROVIDED — ventures page meta description]',
    },
    {
      slug: 'achievements',
      eyebrow: 'Achievements',
      heading: 'Recognition, awards, and milestones.',
      ledgerStats: [
        { value: '[00]', label: 'Awards' },
        { value: '[00]', label: 'Exits' },
        { value: '[00]', label: 'Board Seats' },
        { value: '[00]', label: 'Publications' },
      ],
      seoTitle: 'Achievements — Kemil Shah',
      seoDescription: '[CONTENT TO BE PROVIDED — achievements page meta description]',
    },
    {
      slug: 'media',
      eyebrow: 'Media & Press',
      heading: 'Interviews, features, and coverage.',
      secondaryHeading: 'Media Kit',
      secondaryBody: 'Approved headshots, bio, and press assets available on request.',
      seoTitle: 'Media & Press — Kemil Shah',
      seoDescription: '[CONTENT TO BE PROVIDED — media page meta description]',
    },
    {
      slug: 'lifestyle',
      eyebrow: 'Lifestyle',
      heading: 'Beyond the boardroom.',
      intro: lorem,
      secondaryHeading: '[CONTENT TO BE PROVIDED — feature headline]',
      secondaryBody: lorem,
      seoTitle: 'Lifestyle — Kemil Shah',
      seoDescription: '[CONTENT TO BE PROVIDED — lifestyle page meta description]',
    },
    {
      slug: 'philanthropy',
      eyebrow: 'Philanthropy',
      heading: 'Giving back to [CONTENT TO BE PROVIDED — cause area].',
      ledgerStats: [
        { value: '[00]', label: 'Causes Supported' },
        { value: '[00]', label: 'Years Involved' },
        { value: '[00]', label: 'Partner Organizations' },
      ],
      seoTitle: 'Philanthropy — Kemil Shah',
      seoDescription: '[CONTENT TO BE PROVIDED — philanthropy page meta description]',
    },
    {
      slug: 'speaking',
      eyebrow: 'Speaking & Events',
      heading: 'Available for keynotes, panels, and fireside chats.',
      secondaryHeading: 'Selected Stages',
      secondaryBody: lorem,
      seoTitle: 'Speaking & Events — Kemil Shah',
      seoDescription: '[CONTENT TO BE PROVIDED — speaking page meta description]',
    },
    {
      slug: 'contact',
      eyebrow: 'Contact',
      heading: 'Get in touch.',
      intro: 'For business inquiries, press, or general questions — lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      seoTitle: 'Contact — Kemil Shah',
      seoDescription: '[CONTENT TO BE PROVIDED — contact page meta description]',
    },
  ];

  for (const data of pages) {
    await strapi.documents('api::page.page').create({ data, status: 'published' });
  }

  const headerLinks = [
    { label: 'Home', url: '/', order: 1 },
    { label: 'About', url: '/about', order: 2 },
    { label: 'Business Ventures', url: '/ventures', order: 3 },
    { label: 'Achievements', url: '/achievements', order: 4 },
    { label: 'Media & Press', url: '/media', order: 5 },
    { label: 'Lifestyle', url: '/lifestyle', order: 6 },
    { label: 'Philanthropy', url: '/philanthropy', order: 7 },
    { label: 'Speaking', url: '/speaking', order: 8 },
    { label: 'Contact', url: '/contact', order: 9 },
  ];
  const footerLinks = [
    { label: 'About', url: '/about', order: 1 },
    { label: 'Media Kit', url: '/media', order: 2 },
    { label: 'Contact', url: '/contact', order: 3 },
  ];

  for (const l of [...headerLinks.map((l) => ({ ...l, placement: 'header' })), ...footerLinks.map((l) => ({ ...l, placement: 'footer' }))]) {
    await strapi.documents('api::site-link.site-link').create({ data: l });
  }

  await strapi.documents('api::site-setting.site-setting').create({
    data: {
      wordmark: 'Kemil Shah',
      positioningStatement: '[CONTENT TO BE PROVIDED — one-line founder positioning statement]',
      footerBlurb: '[CONTENT TO BE PROVIDED — one-line founder positioning statement]',
      email: '[CONTENT TO BE PROVIDED — email address]',
      location: '[CONTENT TO BE PROVIDED — city / region]',
      socialLinksNote: '[CONTENT TO BE PROVIDED — social links]',
      mediaKitUrl: '',
    },
  });

  const sampleVentures = [1, 2, 3].map((n) => ({
    name: `[CONTENT TO BE PROVIDED — Venture ${n}]`,
    industry: '[Industry]',
    stage: '[Stage]',
    summary: lorem,
    order: n,
  }));
  for (const v of sampleVentures) await strapi.documents('api::venture.venture').create({ data: v, status: 'published' });

  const sampleAchievements = [1, 2, 3, 4].map((n) => ({
    title: `[CONTENT TO BE PROVIDED — Award / Milestone ${n}]`,
    year: '[YYYY]',
    description: lorem,
    order: n,
  }));
  for (const a of sampleAchievements) await strapi.documents('api::achievement.achievement').create({ data: a, status: 'published' });

  const sampleTimeline = [1, 2, 3, 4].map((n) => ({
    year: '[YYYY]',
    title: '[CONTENT TO BE PROVIDED — milestone]',
    description: lorem,
    order: n,
  }));
  for (const t of sampleTimeline) await strapi.documents('api::timeline-entry.timeline-entry').create({ data: t, status: 'published' });

  const sampleValues = [1, 2, 3].map((n) => ({
    title: `[VALUE ${n}]`,
    description: lorem,
    order: n,
  }));
  for (const v of sampleValues) await strapi.documents('api::value.value').create({ data: v, status: 'published' });

  const samplePress = [1, 2, 3, 4, 5, 6].map((n) => ({
    title: `[CONTENT TO BE PROVIDED — Article / Interview Title ${n}]`,
    publication: '[Publication Name]',
    year: '[YYYY]',
    order: n,
  }));
  for (const p of samplePress) await strapi.documents('api::press-item.press-item').create({ data: p, status: 'published' });

  const sampleTopics = ['[Topic One]', '[Topic Two]', '[Topic Three]', '[Topic Four]'].map((title, i) => ({
    title,
    order: i + 1,
  }));
  for (const t of sampleTopics) await strapi.documents('api::speaking-topic.speaking-topic').create({ data: t, status: 'published' });

  const sampleEngagements = [1, 2, 3].map((n) => ({
    eventName: `[CONTENT TO BE PROVIDED — Event / Conference ${n}]`,
    year: '[YYYY]',
    order: n,
  }));
  for (const e of sampleEngagements) await strapi.documents('api::past-engagement.past-engagement').create({ data: e, status: 'published' });

  const samplePhilanthropy = [1, 2, 3].map((n) => ({
    name: `[CONTENT TO BE PROVIDED — Initiative ${n}]`,
    description: lorem,
    order: n,
  }));
  for (const p of samplePhilanthropy) await strapi.documents('api::philanthropy-initiative.philanthropy-initiative').create({ data: p, status: 'published' });

  strapi.log.info('[seed] initial placeholder content created across all content types');
}

module.exports = {
  register() {},

  async bootstrap({ strapi }) {
    const publicRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });

    if (!publicRole) return;

    for (const uid of PUBLIC_READABLE) {
      for (const action of ACTIONS) {
        const actionId = `${uid}.${action}`;
        const existing = await strapi
          .query('plugin::users-permissions.permission')
          .findOne({ where: { action: actionId, role: publicRole.id } });

        if (!existing) {
          await strapi.query('plugin::users-permissions.permission').create({
            data: { action: actionId, role: publicRole.id },
          });
          strapi.log.info(`[bootstrap] granted public ${actionId}`);
        }
      }
    }

    await seedIfEmpty(strapi);
  },
};
