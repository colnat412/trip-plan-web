import type { MapPlacePrediction } from '@/base/types/maps';
import type { PlanActivity } from '@/features/plan/types';
import { POPULAR_DESTINATIONS } from '../data/destination-photos';

export interface PlaceSuggestion {
  id: string;
  title: string;
  location: string;
  imageUrl?: string;
}

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const placeKey = (value: string) => {
  const key = normalize(value.split(',')[0]);
  if (
    ['dinh doc lap', 'independence palace', 'reunification palace'].includes(
      key,
    )
  )
    return 'independence-palace';
  if (['cho ben thanh', 'ben thanh market'].includes(key))
    return 'ben-thanh-market';
  return key;
};

// Editorial starting points for the six popular destinations; maps adds live results.
const cityPlaces: Record<
  string,
  { title: string; imageUrl?: string; id?: string; street?: string }[]
> = {
  'TP. Hồ Chí Minh': [
    {
      id: 'hcmc-independence-palace',
      title: 'Dinh Độc Lập',
      street: 'Đường Nam Kỳ Khởi Nghĩa',
      imageUrl: '/places/independence-palace.jpg',
    },
    {
      id: 'hcmc-ben-thanh-market',
      title: 'Chợ Bến Thành',
      street: 'Đường Lê Lợi',
      imageUrl: '/places/ben-thanh-market.jpg',
    },
    { title: 'Landmark 81', imageUrl: '/destinations/saigon-photo.png' },
    { title: 'Bưu điện Trung tâm Sài Gòn' },
    { title: 'Phố đi bộ Nguyễn Huệ' },
    { title: 'Bảo tàng Chứng tích Chiến tranh' },
  ],
  'Hà Nội': [
    { title: 'Hồ Gươm', imageUrl: '/destinations/hanoi-photo.jpg' },
    { title: 'Văn Miếu – Quốc Tử Giám' },
    { title: 'Phố cổ Hà Nội' },
    { title: 'Đền Ngọc Sơn' },
    { title: 'Chùa Một Cột' },
  ],
  'Đà Nẵng': [
    { title: 'Cầu Rồng', imageUrl: '/destinations/danang-photo.jpg' },
    { title: 'Bãi biển Mỹ Khê' },
    { title: 'Ngũ Hành Sơn' },
    { title: 'Chùa Linh Ứng Bãi Bụt' },
    { title: 'Bảo tàng Điêu khắc Chăm' },
  ],
  'Đà Lạt': [
    { title: 'Hồ Xuân Hương', imageUrl: '/destinations/dalat-photo.jpg' },
    { title: 'Quảng trường Lâm Viên' },
    { title: 'Ga Đà Lạt' },
    { title: 'Thác Datanla' },
    { title: 'Thiền viện Trúc Lâm Đà Lạt' },
  ],
  'Hội An': [
    { title: 'Phố cổ Hội An', imageUrl: '/destinations/hoian-photo.jpg' },
    { title: 'Chùa Cầu' },
    { title: 'Làng gốm Thanh Hà' },
    { title: 'Biển An Bàng' },
    { title: 'Làng rau Trà Quế' },
  ],
  'Phú Quốc': [
    { title: 'Bãi Sao', imageUrl: '/destinations/phuquoc-photo.jpg' },
    { title: 'Dinh Cậu' },
    { title: 'Bãi Trường' },
    { title: 'Nhà tù Phú Quốc' },
    { title: 'Vườn quốc gia Phú Quốc' },
  ],
};
export const getPlaceSuggestions = (
  destination: string,
  predictions: MapPlacePrediction[],
): PlaceSuggestion[] => {
  const city = POPULAR_DESTINATIONS.find((item) =>
    [item.name, ...item.aliases].some(
      (alias) => normalize(alias) === normalize(destination.split(',')[0]),
    ),
  );
  const curated: PlaceSuggestion[] = city
    ? (cityPlaces[city.name] ?? []).map((place) => {
        const match = predictions.find(
          (item) => placeKey(item.mainText) === placeKey(place.title),
        );
        const address = match
          ? getPlaceAddress(
              {
                id: '',
                title: place.title,
                location: match.secondaryText || match.description,
              },
              city.name,
            )
          : '';
        return {
          id:
            place.id ??
            `curated-${normalize(city.name)}-${placeKey(place.title)}`,
          title: place.title,
          location: address && match
            ? match.secondaryText ? [place.title, match.secondaryText].join(', ') : match.description
            : [place.title, place.street, city.name].filter(Boolean).join(', '),
          imageUrl: place.imageUrl,
        };
      })
    : [];
  const seen = new Set<string>();
  return [
    ...curated,
    ...predictions.map((place) => ({
      id: `${place.source}-${place.placeId}`,
      title: place.mainText,
      location:
        place.description ||
        [place.mainText, place.secondaryText].filter(Boolean).join(', '),
    })),
  ]
    .filter((place) => {
      const key = placeKey(place.title);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 12);
};

export const getPlaceAddress = (
  place: PlaceSuggestion,
  destination: string,
) => {
  const city = POPULAR_DESTINATIONS.find((item) =>
    [item.name, ...item.aliases].some(
      (alias) => destination.split(',').some(part => normalize(alias) === normalize(part)),
    ),
  );
  const excluded = new Set(
    [
      destination.split(',')[0],
      ...(city ? [city.name, ...city.aliases] : []),
      'Việt Nam',
      'Vietnam',
      'VN',
    ].map(normalize),
  );
  const parts = place.location
    .split(',')
    .map((value) => {
      const part = value.trim();
      // Vietmap sometimes joins the venue and road without a separating comma.
      return part.toLocaleLowerCase().startsWith(place.title.toLocaleLowerCase())
        ? part.slice(place.title.length).replace(/^[\s,–-]+/, '') : part;
    })
    .filter(
      (value) =>
        value &&
        !excluded.has(normalize(value)) &&
        placeKey(value) !== placeKey(place.title) &&
        !/^(thanh pho|tp|tinh|quan|huyen|province|city|district)\b/.test(normalize(value)) &&
        !/\bcity$/.test(normalize(value)),
    );
  const isWard = (value: string) => /^(phuong|xa|thi tran|ward|commune)\b/.test(normalize(value));
  const street = parts.find(value => !isWard(value) && !/^\d+$/.test(value));
  if (street) {
    // Hide building numbers while preserving road names such as "3 Tháng 2".
    return /^\d+\s+thang\b/.test(normalize(street)) ? street
      : street.replace(/^\d+[a-z]?(?:[/-]\d+[a-z]?)*\s+/i, '');
  }
  return parts.find(isWard) ?? '';
};

export const isPlaceInPlan = (
  place: PlaceSuggestion,
  activities: Pick<PlanActivity, 'title' | 'location'>[],
) =>
  activities.some(
    (activity) =>
      placeKey(activity.title) === placeKey(place.title) ||
      Boolean(
        activity.location &&
        placeKey(activity.location) === placeKey(place.title),
      ),
  );
