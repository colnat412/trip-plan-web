export type MapsSource = 'vietmap' | 'osm';

export interface MapCoordinates {
  latitude: number;
  longitude: number;
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
