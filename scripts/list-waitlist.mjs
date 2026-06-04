// Read-only list of waitlist signups from R2.
// Run from landing/ root: `node scripts/list-waitlist.mjs`
// Outputs a table sorted newest-first.
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { config } from 'dotenv';
config({ path: new URL('../.env.local', import.meta.url).pathname });

const r2 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET = process.env.R2_BUCKET_NAME ?? 'hyeland-media';
const KEY = 'waitlist/signups.json';

try {
  const res = await r2.send(new GetObjectCommand({ Bucket: BUCKET, Key: KEY }));
  const text = await res.Body.transformToString();
  const signups = JSON.parse(text);

  if (!Array.isArray(signups) || signups.length === 0) {
    console.log('No signups yet.');
    process.exit(0);
  }

  // Newest first
  signups.sort((a, b) => (b.timestamp ?? '').localeCompare(a.timestamp ?? ''));

  console.log(`\n${signups.length} signup${signups.length === 1 ? '' : 's'}:\n`);
  console.log('  ' + 'TIMESTAMP'.padEnd(22) + 'LOCALE'.padEnd(8) + 'EMAIL');
  console.log('  ' + '─'.repeat(22) + ' '.repeat(2) + '─'.repeat(6) + ' '.repeat(2) + '─'.repeat(40));
  for (const s of signups) {
    const ts = (s.timestamp ?? '').slice(0, 19).replace('T', ' ');
    const loc = (s.locale ?? '?').padEnd(6);
    console.log(`  ${ts.padEnd(22)}${loc.padEnd(8)}${s.email}`);
  }
  console.log('');
} catch (err) {
  if (err?.name === 'NoSuchKey' || err?.Code === 'NoSuchKey') {
    console.log('No signups yet (R2 key does not exist).');
  } else {
    console.error('Error reading waitlist:', err?.message ?? err);
    process.exit(1);
  }
}
