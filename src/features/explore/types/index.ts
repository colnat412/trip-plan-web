import type { MapCoordinates } from "@/base/types/maps";
export const PLACE_CATEGORIES = ["SIGHT", "FOOD", "STAY", "OTHER"] as const;
export type PlaceCategory = (typeof PLACE_CATEGORIES)[number];
export interface PlaceBounds {
  west: number;
  south: number;
  east: number;
  north: number;
}
export interface PlacePin extends MapCoordinates {
  id: string;
  title: string;
}
export interface ExploreItinerary {
  id: string;
  title: string;
  destination: string;
  coverUrl: string | null;
  durationDays: number;
  likeCount: number;
  latitude: number | null;
  longitude: number | null;
}

export interface ExploreMapSelection extends PlacePin {
  description: string;
  activity: Pick<
    import("@/features/plan/types").CreateActivityPayload,
    "title" | "location" | "category"
  >;
}
