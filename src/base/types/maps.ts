export type MapsSource = 'vietmap' | 'osm';

export interface MapCoordinates {
  latitude: number;
  longitude: number;
}

export interface MapStop {
  id: string;
  label: string;
  order: number;
  coordinates: MapCoordinates;
  completed?: boolean;
  // Điểm của ngày không được chọn: vẫn hiện trên bản đồ nhưng mờ và không nối đường.
  dimmed?: boolean;
}

export interface MapPlacePrediction {
  placeId: string;
  mainText: string;
  secondaryText: string;
  description: string;
  source: MapsSource;
  coordinates?: MapCoordinates;
}

export interface MapDistanceElement {
  status: 'OK' | 'ZERO_RESULTS';
  source: MapsSource;
  distance?: { value: number; text: string };
  duration?: { value: number; text: string };
}

export interface MapDistanceMatrix {
  status: 'OK';
  source: MapsSource;
  origin_addresses: string[];
  destination_addresses: string[];
  rows: Array<{ elements: MapDistanceElement[] }>;
}
