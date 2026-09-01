import { Router } from 'express';
import { saveSubmission } from '../store.js';
import { notify } from '../mailer.js';

const router = Router();

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

router.post('/', async (req, res) => {
  const { name, organization, email, eventDate, message, company } = req.body || {};

  // Honeypot field.
  if (company) {
    return res.status(200).json({ status: 'ok' });
  }

  if (!name || !organization || !email || !message) {
    return res.status(400).json({ error: 'Name, organization, email, and details are required.' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  const record = saveSubmission('speaking-inquiry', { name, organization, email, eventDate, message });
  await notify(`New speaking inquiry from ${organization}`, `From: ${name} <${email}>\nEvent date: ${eventDate || 'n/a'}\n\n${message}`);

  res.status(201).json({ status: 'ok', id: record.receivedAt });
});

export default router;
