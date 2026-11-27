"use client";
import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { useDebouncedValue, useQueryGet } from "@/base/hooks";
import { useOptionalUserContext } from "@/features/user/context/UserContext";
import type { MapCoordinates, MapPlacePrediction } from "@/base/types/maps";
import type { ExploreMapSelection } from "../types";
const valid = (point?: MapCoordinates | null): point is MapCoordinates =>
  !!point &&
  Number.isFinite(point.latitude) &&
  Math.abs(point.latitude) <= 85 &&
  Number.isFinite(point.longitude) &&
  Math.abs(point.longitude) <= 180;
export default function useExploreMapSearch() {
  const account = useOptionalUserContext();
  const [search, setSearch] = useState("");
  const [chosen, setChosen] = useState<MapPlacePrediction | null>(null);
  const term = search.trim();
  const settled = useDebouncedValue(term);
  const language = useLocale() === "en" ? "en" : "vi";
  const enabled =
    !!account?.user && term.length >= 2 && term === settled && !chosen;
  const query = useQueryGet<{ predictions: MapPlacePrediction[] }>({
    queryKey: ["explore-map-search", settled, language],
    endPoint: "/maps/places",
    enabled,
    config: { params: { q: settled, lang: language } },
  });
  const lookup =
    chosen && !valid(chosen.coordinates)
      ? chosen.description || chosen.mainText
      : "";
  const location = useQueryGet<{
    location: { coordinates: MapCoordinates } | null;
  }>({
    queryKey: ["explore-map-result", chosen?.placeId, lookup, language],
    endPoint: "/maps/location",
    enabled: !!account?.user && !!lookup,
    config: { params: { q: lookup, lang: language } },
  });
  const coordinates =
    chosen && valid(chosen.coordinates)
      ? chosen.coordinates
      : !location.isStale && !location.error
        ? location.data?.location?.coordinates
        : null;
  const selection = useMemo<ExploreMapSelection | null>(
    () =>
      chosen && valid(coordinates)
        ? {
            id: `map-search:${chosen.placeId}`,
            title: chosen.mainText || chosen.description,
            description: chosen.description,
            ...coordinates,
            activity: {
              title: chosen.mainText || chosen.description,
              location: chosen.description || chosen.mainText,
              category: "OTHER",
            },
          }
        : null,
    [chosen, coordinates],
  );
  return {
    search,
    chosen,
    selection,
    options:
      enabled && !query.isStale && !query.error
        ? (query.data?.predictions ?? [])
        : [],
    loading:
      !!account?.user &&
      term.length >= 2 &&
      !chosen &&
      (term !== settled || query.isFetching || query.isStale),
    resolving:
      !!lookup && !location.error && (location.isStale || location.isFetching),
    error: enabled ? query.error : chosen ? location.error : null,
    loginRequired: term.length >= 2 && !account?.isLoading && !account?.user,
    changeSearch: (value: string) => {
      setSearch(value);
      setChosen(null);
    },
    choose: (prediction: MapPlacePrediction) => {
      setChosen(prediction);
      setSearch(prediction.description || prediction.mainText);
    },
    clear: () => {
      setSearch("");
      setChosen(null);
    },
  };
}
