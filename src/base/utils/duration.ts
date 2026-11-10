/** Format route durations from seconds using localized hour/minute units. */
export const formatDuration = (seconds: number, language = 'vi'): string => {
  if (!Number.isFinite(seconds) || seconds < 0) return '';
  const minutes = seconds > 0 ? Math.max(1, Math.round(seconds / 60)) : 0;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const locale = language.startsWith('en') ? 'en-US' : 'vi-VN';
  const formatUnit = (value: number, unit: 'hour' | 'minute') =>
    new Intl.NumberFormat(locale, {
      style: 'unit',
      unit,
      unitDisplay: 'long',
    }).format(value);

  if (hours === 0) return formatUnit(minutes, 'minute');
  if (remainingMinutes === 0) return formatUnit(hours, 'hour');
  return `${formatUnit(hours, 'hour')} ${formatUnit(remainingMinutes, 'minute')}`;
};
