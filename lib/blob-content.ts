import { list } from '@vercel/blob';
import { readFile } from 'fs/promises';

/**
 * Read content JSON: Blob first (admin edits on live), filesystem fallback (git-deployed defaults).
 */
export async function readBlobOrFs(blobKey: string, fsPath: string): Promise<string> {
  try {
    const { blobs } = await list({ prefix: blobKey, limit: 1 });
    const match = blobs.find((b) => b.pathname === blobKey);
    if (match) {
      const res = await fetch(match.url);
      return res.text();
    }
  } catch {
    // fall through to filesystem
  }
  return readFile(fsPath, 'utf-8');
}
