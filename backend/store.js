import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

/**
 * Minimal append-only NDJSON store so form submissions survive a restart
 * without pulling in a database dependency for this starter. Swap for a
 * real table (see spec Section 15, Database Architecture) before launch —
 * this has no querying, indexing, or deletion (needed for GDPR/CCPA
 * data-subject requests per spec Section 76).
 */
export function saveSubmission(kind, payload) {
  const file = path.join(DATA_DIR, `${kind}.ndjson`);
  const record = { ...payload, receivedAt: new Date().toISOString() };
  fs.appendFileSync(file, JSON.stringify(record) + '\n');
  return record;
}
