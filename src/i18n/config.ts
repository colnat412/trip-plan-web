export const locales = ["vi", "en"] as const;

export type AppLocale = (typeof locales)[number];

/** Add display metadata here when enabling another translated locale. */
export const localeDisplay: Record<AppLocale, { name: string; flag: string }> = {
  vi: { name: 'Tiếng Việt', flag: '🇻🇳' },
  en: { name: 'English', flag: '🇬🇧' },
};

export const defaultLocale: AppLocale = "vi";
export const localeCookieName = "trip-budget-locale";

export function isAppLocale(value: string | undefined): value is AppLocale {
  return locales.some((locale) => locale === value);
}
