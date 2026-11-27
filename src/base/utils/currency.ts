function resolveLocale(locale?: string): string {
  if (locale && locale.trim()) return locale;
  if (typeof document !== 'undefined') {
    if (document.documentElement.lang) {
      return document.documentElement.lang;
    }
    const match = document.cookie.match(/trip-budget-locale=([^;]+)/);
    if (match && match[1]) {
      return match[1];
    }
  }
  return 'vi';
}

/** One number + ISO-code convention for every money label. */
export function formatMoney(
  amount: number | string | null | undefined,
  currency = 'VND',
  locale?: string,
): string {
  const numericAmount = Number.isFinite(Number(amount)) ? Number(amount) : 0;
  const code = currency.trim().toUpperCase() || 'VND';
  const targetLocale = resolveLocale(locale).toLowerCase().startsWith('en') ? 'en-US' : 'vi-VN';
  let digits = 2;
  try {
    digits = new Intl.NumberFormat(targetLocale, { style: 'currency', currency: code })
      .resolvedOptions().maximumFractionDigits ?? 2;
  } catch { /* Unknown currency codes still get a readable numeric label. */ }
  return `${new Intl.NumberFormat(targetLocale, { maximumFractionDigits: digits }).format(numericAmount)} ${code}`;
}

export function formatMoneyCompact(
  amount: number | string | null | undefined,
  currency = 'VND',
  locale?: string,
): string {
  const numericAmount = Number.isFinite(Number(amount)) ? Number(amount) : 0;
  const code = currency.trim().toUpperCase() || 'VND';
  const english = resolveLocale(locale).toLowerCase().startsWith('en');
  const targetLocale = english ? 'en-US' : 'vi-VN';
  if (code !== 'VND') {
    return `${new Intl.NumberFormat(targetLocale, { notation: 'compact', maximumFractionDigits: 1 }).format(numericAmount)} ${code}`;
  }
  // Choose the unit after rounding, so 999,999 does not become "1.000 k".
  const rounded = Math.round(Math.abs(numericAmount) / 100) * 100;
  const unit = rounded >= 1_000_000_000 ? 1_000_000_000
    : rounded >= 1_000_000 ? 1_000_000 : rounded >= 1_000 ? 1_000 : 1;
  if (unit === 1) return formatMoney(numericAmount, code, locale);
  const suffix = unit === 1_000_000_000 ? (english ? 'B' : 'tỷ')
    : unit === 1_000_000 ? (english ? 'M' : 'tr') : (english ? 'K' : 'k');
  const value = new Intl.NumberFormat(targetLocale, { maximumFractionDigits: 1 }).format(numericAmount / unit);
  return `${value} ${suffix} ${code}`;
}

// Existing screens, notifications and exports share the same implementation.
export const formatCurrency = formatMoney;
export const formatCompactCurrency = formatMoneyCompact;

export function formatNumber(
  value: number | string | null | undefined,
  locale = 'vi-VN',
): string {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return '0';
  }

  return Number(value).toLocaleString(locale);
}

export function formatNumberInput(
  value: number | string | null | undefined,
  allowDecimals = true,
): string {
  if (value === null || value === undefined || value === '') return '';
  const str = String(value).replace(/,/g, '');
  if (!allowDecimals) {
    const clean = str.replace(/[^\d]/g, '').replace(/^0+(?=\d)/, '');
    if (!clean) return '';
    return clean.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  const parts = str.split('.');
  const intPart = parts[0].replace(/[^\d]/g, '').replace(/^0+(?=\d)/, '');
  const formattedInt = intPart
    ? intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    : parts.length > 1
      ? '0'
      : '';
  if (parts.length > 1) {
    const decimalPart = parts[1].replace(/[^\d]/g, '');
    return `${formattedInt}.${decimalPart}`;
  }
  return formattedInt;
}

export function parseNumberInput(value: string | number | null | undefined): {
  numericValue: number | undefined;
  rawString: string;
} {
  if (value === null || value === undefined || value === '') {
    return { numericValue: undefined, rawString: '' };
  }
  const rawString = String(value).replace(/,/g, '').trim();
  if (rawString === '' || rawString === '.') {
    return { numericValue: undefined, rawString: '' };
  }
  const numericValue = Number(rawString);
  return {
    numericValue: isNaN(numericValue) ? undefined : numericValue,
    rawString,
  };
}
