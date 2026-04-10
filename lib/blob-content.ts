import { readFile } from 'fs/promises';
import { getCachedUrl, setCachedUrl, getBlobStoreUrl } from '@/lib/blob-url-cache';
import { blobCacheTag } from '@/lib/content';

/**
 * Read content JSON: Blob first (admin edits on live), filesystem fallback (git-deployed defaults).
 */
export async function readBlobOrFs(blobKey: string, fsPath: string): Promise<string> {
  try {
    const url = getCachedUrl(blobKey) ?? `${getBlobStoreUrl()}/${blobKey}`;
    const res = await fetch(url, { next: { revalidate: 60, tags: [blobCacheTag(blobKey)] } });
    if (!res.ok) throw new Error(`blob ${res.status}`);
    if (!getCachedUrl(blobKey)) setCachedUrl(blobKey, url);
    return res.text();
  } catch {
    // 404 = no blob override yet, or network error — fall through to filesystem
  }
  return readFile(fsPath, 'utf-8');
}
