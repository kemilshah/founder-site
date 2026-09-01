import { Router } from 'express';
import { saveSubmission } from '../store.js';
import { notify } from '../mailer.js';

const router = Router();

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

router.post('/', async (req, res) => {
  const { name, email, subject, message, company } = req.body || {};

  // Honeypot field — real users never fill this in.
  if (company) {
    return res.status(200).json({ status: 'ok' });
  }

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  const record = saveSubmission('contact', { name, email, subject, message });
  await notify(`New contact form submission: ${subject}`, `From: ${name} <${email}>\n\n${message}`);

  res.status(201).json({ status: 'ok', id: record.receivedAt });
});

export default router;
