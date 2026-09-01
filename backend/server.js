import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import 'dotenv/config';

import contactRouter from './routes/contact.js';
import speakingRouter from './routes/speaking.js';
import contentRouter from './routes/content.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Behind Render/Cloudflare's proxy in production — needed for
// express-rate-limit and req.ip to see the real client IP instead of
// the proxy's.
app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '100kb' }));

// Basic rate limiting for form submission endpoints (per Section 79 of spec).
const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/contact', formLimiter, contactRouter);
app.use('/api/speaking-inquiry', formLimiter, speakingRouter);
app.use('/api/content', contentRouter);

// Central error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Founder site API listening on http://localhost:${PORT}`);
});
