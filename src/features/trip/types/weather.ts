export type WeatherCondition = 'UNKNOWN' | 'CLEAR' | 'PARTLY_CLOUDY' | 'CLOUDY' | 'FOG' | 'DRIZZLE' | 'RAIN' | 'SNOW' | 'THUNDERSTORM';

export interface TripWeather {
  state: 'READY' | 'OUT_OF_RANGE' | 'PAST' | 'UNAVAILABLE' | 'LOCATION_UNAVAILABLE' | 'HIDDEN';
  date: string | null;
  reason?: string | null;
  summary: { startDate: string; endDate: string; dayCount: number; temperatureC: number; condition: WeatherCondition } | null;
}
