/** Real landmark photographs, stored locally. Credits: /destinations/credits.html. */
export const POPULAR_DESTINATIONS = [
  { name: 'Đà Nẵng', image: '/destinations/danang-photo.jpg', aliases: ['Da Nang'] },
  { name: 'Đà Lạt', image: '/destinations/dalat-photo.jpg', aliases: ['Da Lat', 'Dalat'] },
  { name: 'Hà Nội', image: '/destinations/hanoi-photo.jpg', aliases: ['Hanoi', 'Ha Noi'] },
  { name: 'Hội An', image: '/destinations/hoian-photo.jpg', aliases: ['Hoi An'] },
  { name: 'Phú Quốc', image: '/destinations/phuquoc-photo.jpg', aliases: ['Phu Quoc'] },
  { name: 'TP. Hồ Chí Minh', image: '/destinations/saigon-photo.png', aliases: ['Hồ Chí Minh', 'Ho Chi Minh City', 'Thành phố Hồ Chí Minh', 'TPHCM', 'TP HCM', 'Sài Gòn', 'Saigon'] },
] as const;

const normalizeName = (name: string) => name.split(',')[0].normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').replace(/\./g, ' ')
  .toLowerCase().replace(/\s+/g, ' ').trim();

export const getDestinationPhoto = (name: string) => {
  const normalized = normalizeName(name);
  return POPULAR_DESTINATIONS.find(destination =>
    [destination.name, ...destination.aliases].some(alias => normalizeName(alias) === normalized),
  )?.image;
};
