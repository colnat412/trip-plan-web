"use client";
import { useMemo, useState } from "react";
import { useDebouncedValue, useInfiniteQueryGet } from "@/base/hooks";
import type { ExploreItinerary, PlaceBounds, PlacePin } from "../types";

export default function useExplorePlaces() {
  const [search, setSearch] = useState("");
  const settled = useDebouncedValue(search);
  const [category, setCategory] = useState("");
  const [area, setArea] = useState<PlaceBounds | null>(null);
  const [viewport, setViewport] = useState<PlaceBounds | null>(null);
  const [selected, setSelected] = useState<ExploreItinerary | null>(null);
  const params = { q: settled, category, ...area };
  const query = useInfiniteQueryGet<ExploreItinerary>({
    queryKey: ["template-map", params],
    endPoint: "/public/plan-templates/map",
    pageSize: 8,
    params,
    enabled: settled === search,
    getItemKey: (place) => place.id,
  });
  const items = useMemo(
    () => (settled === search ? query.items : []),
    [settled, search, query.items],
  );
  const pins = useMemo<PlacePin[]>(
    () =>
      items.flatMap((place) =>
        place.latitude !== null && place.longitude !== null
          ? [
              {
                id: place.id,
                title: place.title,
                latitude: place.latitude,
                longitude: place.longitude,
              },
            ]
          : [],
      ),
    [items],
  );
  const selectedId = selected?.id ?? null;
  const selectedPin =
    selected?.latitude != null && selected.longitude != null
      ? {
          id: selected.id,
          title: selected.title,
          latitude: selected.latitude,
          longitude: selected.longitude,
        }
      : null;
  const setSelectedId = (id: string | null) => {
    if (id === null) setSelected(null);
    else {
      const choice = items.find((item) => item.id === id);
      if (choice) setSelected(choice);
    }
  };
  return {
    search,
    category,
    area,
    query,
    items,
    pins,
    selected,
    selectedPin,
    selectedId,
    setSelectedId,
    setViewport,
    loading: settled !== search || query.isLoading,
    missingCoordinates: items.some(
      (place) => place.latitude === null || place.longitude === null,
    ),
    changeSearch: (value: string) => {
      setSearch(value);
    },
    changeCategory: (value: string) => {
      setCategory(value);
    },
    searchArea: () => {
      setArea(viewport);
    },
    resetArea: () => {
      setArea(null);
    },
    areaChanged:
      !!viewport && JSON.stringify(viewport) !== JSON.stringify(area),
  };
}
