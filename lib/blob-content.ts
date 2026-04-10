import { readFile } from 'fs/promises';
import { r2GetText } from '@/lib/r2';

/**
 * Read content JSON: R2 first (admin edits on live), filesystem fallback (git-deployed defaults).
 */
export async function readBlobOrFs(key: string, fsPath: string): Promise<string> {
  try {
    const text = await r2GetText(key);
    if (text) return text;
  } catch {
    // R2 error — fall through to filesystem
  }
  return readFile(fsPath, 'utf-8');
}
