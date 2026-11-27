"use client";
import { useMemo } from "react";
import { useInfiniteQueryGet } from "@/base/hooks";
import type { MapStop } from "@/base/types/maps";
interface TemplateMapStop {
  id: string;
  label: string;
  order: number;
  latitude: number | null;
  longitude: number | null;
}
export default function useTemplateMap(
  templateId: string,
  dayNumber: number,
  contentVersion?: number,
) {
  const query = useInfiniteQueryGet<TemplateMapStop>({
    queryKey: ["template-map-day", templateId, dayNumber, contentVersion],
    endPoint: `/public/plan-templates/${encodeURIComponent(templateId)}/map`,
    params: { day: dayNumber, version: contentVersion },
    pageSize: 8,
    enabled: !!templateId && dayNumber > 0,
    getItemKey: (stop) => stop.id,
  });
  const stops = useMemo<MapStop[]>(
    () =>
      query.items.flatMap((stop) =>
        stop.latitude !== null && stop.longitude !== null
          ? [
              {
                id: stop.id,
                label: stop.label,
                order: stop.order,
                coordinates: {
                  latitude: stop.latitude,
                  longitude: stop.longitude,
                },
              },
            ]
          : [],
      ),
    [query.items],
  );
  return { ...query, stops, missingCount: query.items.length - stops.length };
}
