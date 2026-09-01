import { Router } from 'express';

const router = Router();

// Placeholder content API. In production this proxies a headless CMS
// (Strapi/Sanity/Contentful — see Section 11 of the technical spec).
// Kept here to demonstrate the shape of a CMS-driven response; the current
// frontend renders lorem ipsum directly for speed and does not call this yet.
router.get('/:section', (req, res) => {
  const { section } = req.params;
  res.json({
    section,
    status: 'placeholder',
    note: 'Wire this endpoint to the CMS. See spec Section 11 (Content Models) and Section 14 (API Architecture).',
    data: '[CONTENT TO BE PROVIDED]',
  });
});

export default router;
