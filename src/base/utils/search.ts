/** Match visible labels without case or Vietnamese diacritics. Empty queries match all labels. */
export const matchesSearch = (label: string, query: string): boolean => {
  const normalize = (text: string) =>
    text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .toLowerCase()
      .trim();
  return normalize(label).includes(normalize(query));
};
