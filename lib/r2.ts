import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

if (!process.env.R2_ENDPOINT) throw new Error('[Hyeland] R2_ENDPOINT is not set');
if (!process.env.R2_ACCESS_KEY_ID) throw new Error('[Hyeland] R2_ACCESS_KEY_ID is not set');
if (!process.env.R2_SECRET_ACCESS_KEY) throw new Error('[Hyeland] R2_SECRET_ACCESS_KEY is not set');

export const BUCKET = process.env.R2_BUCKET_NAME ?? 'hyeland-media';

export const r2 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

/** Public base URL for uploaded media (R2 bucket must have public access enabled). */
export const R2_PUBLIC_BASE = `${process.env.R2_ENDPOINT}/${BUCKET}`;

/** Upload any content to R2. */
export async function r2Put(
  key: string,
  body: string | Buffer | Uint8Array,
  contentType: string,
): Promise<void> {
  await r2.send(
    new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: body, ContentType: contentType }),
  );
}

/**
 * Fetch an R2 object and return its content as a string.
 * Returns null if the object does not exist (NoSuchKey).
 */
export async function r2GetText(key: string): Promise<string | null> {
  try {
    const res = await r2.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
    if (!res.Body) return null;
    return res.Body.transformToString();
  } catch (err: unknown) {
    if (
      typeof err === 'object' &&
      err !== null &&
      'name' in err &&
      (err as { name: string }).name === 'NoSuchKey'
    ) {
      return null;
    }
    throw err;
  }
}
