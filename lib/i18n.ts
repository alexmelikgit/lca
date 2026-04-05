export const LOCALES = ['hy', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE_LOCAL: Locale = 'hy';
export const DEFAULT_LOCALE_DIASPORA: Locale = 'en';

/** Replace the locale segment in a pathname. */
export function switchLocale(pathname: string, newLocale: Locale): string {
  const segments = pathname.split('/');
  // segments[0] is '' (before leading slash), segments[1] is the locale
  segments[1] = newLocale;
  return segments.join('/');
}

/** Extract locale from pathname, or return null if not a valid locale. */
export function getLocaleFromPathname(pathname: string): Locale | null {
  const segment = pathname.split('/')[1];
  return LOCALES.includes(segment as Locale) ? (segment as Locale) : null;
}
