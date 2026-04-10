/**
 * One-time migration: Vercel Blob → Cloudflare R2
 *
 * Usage:
 *   npx tsx scripts/migrate-blob-to-r2.ts [--dry-run]
 *
 * Required env vars (can be in .env.local):
 *   BLOB_READ_WRITE_TOKEN   – Vercel Blob token
 *   R2_ENDPOINT             – https://<account>.r2.cloudflarestorage.com
 *   R2_ACCESS_KEY_ID
 *   R2_SECRET_ACCESS_KEY
 *   R2_BUCKET_NAME          – default: hyeland-media
 */

import { list, head } from '@vercel/blob';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// ── helpers ─────────────────────────────────────────────────────────────────

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function contentTypeFor(key: string): string {
  if (key.endsWith('.json')) return 'application/json';
  if (key.endsWith('.jpg') || key.endsWith('.jpeg')) return 'image/jpeg';
  if (key.endsWith('.png')) return 'image/png';
  if (key.endsWith('.webp')) return 'image/webp';
  if (key.endsWith('.avif')) return 'image/avif';
  return 'application/octet-stream';
}

// ── list all blobs ───────────────────────────────────────────────────────────

async function listAllBlobs(): Promise<{ pathname: string; url: string; size: number }[]> {
  const results: { pathname: string; url: string; size: number }[] = [];
  let cursor: string | undefined;

  do {
    const page = await list({ cursor, limit: 1000, token: process.env.BLOB_READ_WRITE_TOKEN });
    for (const b of page.blobs) {
      results.push({ pathname: b.pathname, url: b.url, size: b.size });
    }
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);

  return results;
}

// ── main ─────────────────────────────────────────────────────────────────────

async function main() {
  const dryRun = process.argv.includes('--dry-run');

  // Validate env
  requireEnv('BLOB_READ_WRITE_TOKEN');
  const r2Endpoint = requireEnv('R2_ENDPOINT');
  const r2AccessKey = requireEnv('R2_ACCESS_KEY_ID');
  const r2SecretKey = requireEnv('R2_SECRET_ACCESS_KEY');
  const bucket = process.env.R2_BUCKET_NAME ?? 'hyeland-media';

  const r2 = new S3Client({
    region: 'auto',
    endpoint: r2Endpoint,
    credentials: { accessKeyId: r2AccessKey, secretAccessKey: r2SecretKey },
  });

  // ── 1. list ────────────────────────────────────────────────────────────────
  console.log('\n=== Listing Vercel Blob objects ===\n');
  const blobs = await listAllBlobs();

  if (blobs.length === 0) {
    console.log('No blobs found. Nothing to migrate.');
    return;
  }

  const totalBytes = blobs.reduce((s, b) => s + b.size, 0);
  const totalKb = (totalBytes / 1024).toFixed(1);

  console.log(`Found ${blobs.length} blob(s)  (${totalKb} KB total)\n`);
  console.log('Key'.padEnd(60), 'Size');
  console.log('-'.repeat(72));
  for (const b of blobs) {
    console.log(b.pathname.padEnd(60), `${(b.size / 1024).toFixed(1)} KB`);
  }

  if (dryRun) {
    console.log('\n[dry-run] Stopping before upload. Re-run without --dry-run to migrate.');
    return;
  }

  // ── 2. migrate ─────────────────────────────────────────────────────────────
  console.log('\n=== Migrating to R2 ===\n');

  let ok = 0;
  let failed = 0;

  for (const blob of blobs) {
    process.stdout.write(`  ${blob.pathname} … `);
    try {
      const res = await fetch(blob.url);
      if (!res.ok) throw new Error(`HTTP ${res.status} fetching blob`);
      const buffer = Buffer.from(await res.arrayBuffer());

      await r2.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: blob.pathname,
          Body: buffer,
          ContentType: contentTypeFor(blob.pathname),
        }),
      );

      console.log('OK');
      ok++;
    } catch (err) {
      console.log(`FAILED — ${(err as Error).message}`);
      failed++;
    }
  }

  // ── 3. summary ─────────────────────────────────────────────────────────────
  console.log('\n=== Summary ===');
  console.log(`  Migrated : ${ok}`);
  if (failed > 0) console.log(`  Failed   : ${failed}`);
  console.log(`  Bucket   : ${bucket}`);
  console.log('');

  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error('\nFatal:', err.message);
  process.exit(1);
});
