"use client";
import { useState } from "react";
import {
  useDebouncedValue,
  useInfiniteQueryGet,
  useQueryGet,
} from "@/base/hooks";
import { useCreateActivity } from "@/features/plan/hooks/usePlanMutation";
import type { ApiResponse } from "@/base/api";
import { useOptionalTripContext } from "@/features/trip/context/TripContext";
import type { Trip } from "@/features/trip/types";
import type { TripPlanOverview } from "@/features/plan/types";
interface TargetDaySelection {
  tripId: string;
  dayId: string;
}
export default function usePlaceTripTarget() {
  const activeTrip = useOptionalTripContext()?.activeTrip ?? null;
  const [search, setSearch] = useState("");
  const q = useDebouncedValue(search);
  const [chosenTrip, setTrip] = useState<Trip | null>(null);
  const trip = chosenTrip ?? activeTrip;
  const [daySelection, setDaySelection] = useState<TargetDaySelection | null>(
    null,
  );
  const dayId =
    trip && daySelection?.tripId === String(trip.id) ? daySelection.dayId : "";
  const setDayId = (value: string) =>
    setDaySelection(trip ? { tripId: String(trip.id), dayId: value } : null);
  const trips = useInfiniteQueryGet<Trip>({
    queryKey: ["place-target-trips", q],
    endPoint: "/trip/my-trips",
    pageSize: 10,
    params: { search: q },
    enabled: q === search,
    getItemKey: (item) => String(item.id),
  });
  const days = useQueryGet<ApiResponse<TripPlanOverview>>({
    queryKey: ["place-target-plan", trip?.id],
    endPoint: `/trip/${trip?.id}/plan`,
    config: { params: { includeActivities: false } },
    enabled: !!trip,
  });
  const plan = !days.isStale && !days.error ? days.data?.data : null;
  const day = plan?.days.find((item) => String(item.id) === dayId) ?? null;
  const create = useCreateActivity({
    tripId: trip?.id ?? "",
    dayId: day?.id ?? "",
  });
  return {
    search,
    setSearch,
    trip,
    dayId,
    setDayId,
    trips: {
      ...trips,
      items: q === search ? trips.items : [],
      isLoading: q !== search || trips.isLoading,
    },
    days,
    plan,
    day,
    create,
    selectTrip: (value: Trip) => {
      setTrip(value);
      setDaySelection(null);
    },
  };
}
