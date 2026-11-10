/** Keep 4+ as a lower bound; never send it as the exact duration 4. */
export const getTemplateDurationParams = (
  duration: string,
): { duration?: number; minDuration?: number } => {
  if (duration === '4+') return { minDuration: 4 };
  if (/^[1-9]\d*$/.test(duration)) return { duration: Number(duration) };
  return {};
};
