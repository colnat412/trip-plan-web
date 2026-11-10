import { formatDuration } from '@/base/utils/duration';
export { formatDuration } from '@/base/utils/duration';
import { axiosClient } from '@/base/api/axios-client';
import type {
  DistanceResult,
  OptimizationResult,
  PlanActivity,
  RouteSegment,
} from '../types';

const MATRIX_BATCH_SIZE = 25;
const pendingDistanceRequests = new Map<
  string,
  Promise<Map<string, DistanceResult>>
>();

export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${meters} m`;
  }
  const km = (meters / 1000).toFixed(1);
  return `${km} km`;
};

export function fetchDistanceMatrix(
  origins: string[],
  destinations: string[],
  lang = 'vi',
  destinationContext?: string,
): Promise<Map<string, DistanceResult>> {
  const requestKey = JSON.stringify([
    origins,
    destinations,
    lang,
    destinationContext ?? '',
  ]);
  const pendingRequest = pendingDistanceRequests.get(requestKey);
  if (pendingRequest) return pendingRequest;

  // Các nơi cần cùng ma trận dùng chung request đang chạy, như useQueryGet.
  // Xóa cả khi thành công/lỗi: lần tải hoặc retry sau vẫn gọi backend mới.
  const request = requestDistanceMatrix(
    origins,
    destinations,
    lang,
    destinationContext,
  ).finally(() => {
    pendingDistanceRequests.delete(requestKey);
  });
  pendingDistanceRequests.set(requestKey, request);
  return request;
}

async function requestDistanceMatrix(
  origins: string[],
  destinations: string[],
  lang = 'vi',
  destinationContext?: string,
): Promise<Map<string, DistanceResult>> {
  const results = new Map<string, DistanceResult>();
  for (
    let originOffset = 0;
    originOffset < origins.length;
    originOffset += MATRIX_BATCH_SIZE
  ) {
    for (
      let destinationOffset = 0;
      destinationOffset < destinations.length;
      destinationOffset += MATRIX_BATCH_SIZE
    ) {
      const originBatch = origins.slice(
        originOffset,
        originOffset + MATRIX_BATCH_SIZE,
      );
      const destinationBatch = destinations.slice(
        destinationOffset,
        destinationOffset + MATRIX_BATCH_SIZE,
      );
      const response = await axiosClient.post('/maps/distance', {
        origins: originBatch,
        destinations: destinationBatch,
        language: lang,
        destinationContext,
      });
      const data = response.data;
      if (
        data?.status !== 'OK' ||
        !Array.isArray(data.rows) ||
        data.rows.length !== originBatch.length
      ) {
        throw new Error('Map service route matrix is unavailable');
      }
      data.rows.forEach(
        (
          row: { elements: Array<DistanceResult & { status: string }> },
          originIndex: number,
        ) => {
          if (
            !Array.isArray(row.elements) ||
            row.elements.length !== destinationBatch.length
          ) {
            throw new Error('Invalid route matrix');
          }
          row.elements.forEach((element, destinationIndex) => {
            if (
              element.status === 'OK' &&
              (element.source === 'vietmap' || element.source === 'osm') &&
              Number.isFinite(element.distance?.value) &&
              element.distance.value >= 0 &&
              Number.isFinite(element.duration?.value) &&
              element.duration.value >= 0
            ) {
              const origin = originBatch[originIndex];
              const destination = destinationBatch[destinationIndex];
              results.set(`${origin}:::${destination}`, {
                ...element,
                duration: {
                  ...element.duration,
                  text: formatDuration(element.duration.value, lang),
                },
              });
            }
          });
        },
      );
    }
  }
  return results;
}

export async function getConsecutiveDistances(
  activities: PlanActivity[],
  lang = 'vi',
  destinationContext?: string,
): Promise<{
  segments: RouteSegment[];
  totalDistanceMeters: number;
  totalDurationSeconds: number;
  formattedTotalDistance: string;
  formattedTotalDuration: string;
}> {
  const activitiesWithLocation = activities.filter(
    (a) => a.location && a.location.trim().length > 0,
  );

  if (activitiesWithLocation.length < 2) {
    return {
      segments: [],
      totalDistanceMeters: 0,
      totalDurationSeconds: 0,
      formattedTotalDistance: '0 km',
      formattedTotalDuration: formatDuration(0, lang),
    };
  }

  const origins: string[] = [];
  const destinations: string[] = [];

  for (let i = 0; i < activitiesWithLocation.length - 1; i++) {
    const originLocation = activitiesWithLocation[i].location!.trim();
    const destinationLocation = activitiesWithLocation[i + 1].location!.trim();
    if (!origins.includes(originLocation)) origins.push(originLocation);
    if (!destinations.includes(destinationLocation))
      destinations.push(destinationLocation);
  }

  const matrix = await fetchDistanceMatrix(
    origins,
    destinations,
    lang,
    destinationContext,
  );

  const segments: RouteSegment[] = [];
  let totalDistanceMeters = 0;
  let totalDurationSeconds = 0;

  for (let i = 0; i < activitiesWithLocation.length - 1; i++) {
    const fromActivity = activitiesWithLocation[i];
    const toActivity = activitiesWithLocation[i + 1];
    const originLocation = fromActivity.location!.trim();
    const destinationLocation = toActivity.location!.trim();

    const info = matrix.get(`${originLocation}:::${destinationLocation}`);
    // Không có tuyến bản đồ thì để connector hiện trạng thái chưa có dữ liệu.
    if (!info) continue;

    totalDistanceMeters += info.distance.value;
    totalDurationSeconds += info.duration.value;

    segments.push({
      fromActivityId: fromActivity.id,
      toActivityId: toActivity.id,
      origin: originLocation,
      destination: destinationLocation,
      distance: info.distance,
      duration: info.duration,
      isEstimated: info.isEstimated,
      source: info.source,
    });
  }

  return {
    segments,
    totalDistanceMeters,
    totalDurationSeconds,
    formattedTotalDistance: formatDistance(totalDistanceMeters),
    formattedTotalDuration: formatDuration(totalDurationSeconds, lang),
  };
}

export async function solveOptimalRoute(
  activities: PlanActivity[],
  options?: {
    startIndex?: number;
    lang?: string;
    destinationContext?: string;
  },
): Promise<OptimizationResult> {
  const lang = options?.lang || 'vi';
  const startIndex = options?.startIndex ?? 0;
  const destinationContext = options?.destinationContext;

  const activitiesWithLocation = activities.filter(
    (a) => a.location && a.location.trim().length > 0,
  );
  const activitiesWithoutLocation = activities.filter(
    (a) => !a.location || a.location.trim().length === 0,
  );

  const defaultResult: OptimizationResult = {
    originalActivities: activities,
    optimizedActivities: activities,
    originalDistanceMeters: 0,
    optimizedDistanceMeters: 0,
    originalDurationSeconds: 0,
    optimizedDurationSeconds: 0,
    savedDistanceMeters: 0,
    savedPercentage: 0,
    savedDurationSeconds: 0,
    formattedOriginalDistance: '0 km',
    formattedOptimizedDistance: '0 km',
    formattedSavedDistance: '0 km',
    formattedOriginalDuration: formatDuration(0, lang),
    formattedOptimizedDuration: formatDuration(0, lang),
    formattedSavedDuration: formatDuration(0, lang),
    isImprovement: false,
    segments: [],
  };

  if (activitiesWithLocation.length < 3) {
    const consecutive = await getConsecutiveDistances(
      activities,
      lang,
      destinationContext,
    );
    if (
      consecutive.segments.length !==
      Math.max(0, activitiesWithLocation.length - 1)
    ) {
      throw new Error('Map service could not find the required route');
    }
    return {
      ...defaultResult,
      originalDistanceMeters: consecutive.totalDistanceMeters,
      optimizedDistanceMeters: consecutive.totalDistanceMeters,
      originalDurationSeconds: consecutive.totalDurationSeconds,
      optimizedDurationSeconds: consecutive.totalDurationSeconds,
      formattedOriginalDistance: consecutive.formattedTotalDistance,
      formattedOptimizedDistance: consecutive.formattedTotalDistance,
      formattedOriginalDuration: consecutive.formattedTotalDuration,
      formattedOptimizedDuration: consecutive.formattedTotalDuration,
      segments: consecutive.segments,
    };
  }

  const uniqueLocations: string[] = [];
  activitiesWithLocation.forEach((a) => {
    const loc = a.location!.trim();
    if (!uniqueLocations.includes(loc)) uniqueLocations.push(loc);
  });

  const matrix = await fetchDistanceMatrix(
    uniqueLocations,
    uniqueLocations,
    lang,
    destinationContext,
  );

  // Không tối ưu dựa trên khoảng cách giả hoặc ma trận thiếu tuyến.
  for (const from of uniqueLocations) {
    for (const to of uniqueLocations) {
      if (from !== to && !matrix.has(`${from}:::${to}`)) {
        throw new Error('Map service could not find all required routes');
      }
    }
  }
  const getDistance = (from: string, to: string) => {
    if (from === to) return 0;
    return matrix.get(`${from}:::${to}`)!.distance.value;
  };
  const getDuration = (from: string, to: string) => {
    if (from === to) return 0;
    return matrix.get(`${from}:::${to}`)!.duration.value;
  };

  let originalDistanceMeters = 0;
  let originalDurationSeconds = 0;
  for (let i = 0; i < activitiesWithLocation.length - 1; i++) {
    const originLocation = activitiesWithLocation[i].location!.trim();
    const destinationLocation = activitiesWithLocation[i + 1].location!.trim();
    originalDistanceMeters += getDistance(originLocation, destinationLocation);
    originalDurationSeconds += getDuration(originLocation, destinationLocation);
  }

  // Bước 1: từ điểm xuất phát, chọn điểm gần nhất chưa đi qua.
  const activityCount = activitiesWithLocation.length;
  const visited = new Array<boolean>(activityCount).fill(false);
  const route: number[] = [];

  const validStart =
    startIndex >= 0 && startIndex < activityCount ? startIndex : 0;
  route.push(validStart);
  visited[validStart] = true;

  while (route.length < activityCount) {
    const last = route[route.length - 1];
    const lastLocation = activitiesWithLocation[last].location!.trim();
    let nearestIndex = -1;
    let nearestDistance = Infinity;

    for (let i = 0; i < activityCount; i++) {
      if (!visited[i]) {
        const distance = getDistance(
          lastLocation,
          activitiesWithLocation[i].location!.trim(),
        );
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = i;
        }
      }
    }

    if (nearestIndex !== -1) {
      visited[nearestIndex] = true;
      route.push(nearestIndex);
    } else {
      break;
    }
  }

  const computeRouteDistance = (routeIndices: number[]): number => {
    let totalDistance = 0;
    for (let index = 0; index < routeIndices.length - 1; index++) {
      totalDistance += getDistance(
        activitiesWithLocation[routeIndices[index]].location!.trim(),
        activitiesWithLocation[routeIndices[index + 1]].location!.trim(),
      );
    }
    return totalDistance;
  };

  let bestRoute = [...route];
  let bestDistance = computeRouteDistance(bestRoute);
  let improved = true;
  let iterations = 0;

  // Bước 2: thử đảo từng đoạn, chỉ giữ thứ tự làm tổng quãng đường ngắn hơn.
  while (improved && iterations < 100) {
    improved = false;
    iterations++;

    for (let i = 1; i < activityCount - 1; i++) {
      for (let k = i + 1; k < activityCount; k++) {
        const newRoute = [...bestRoute];
        const reversedSegment = newRoute.slice(i, k + 1).reverse();
        newRoute.splice(i, reversedSegment.length, ...reversedSegment);

        const candidateDistance = computeRouteDistance(newRoute);
        if (candidateDistance < bestDistance) {
          bestDistance = candidateDistance;
          bestRoute = newRoute;
          improved = true;
        }
      }
    }
  }

  let optimizedDurationSeconds = 0;
  const segments: RouteSegment[] = [];
  for (let i = 0; i < bestRoute.length - 1; i++) {
    const fromActivity = activitiesWithLocation[bestRoute[i]];
    const toActivity = activitiesWithLocation[bestRoute[i + 1]];
    const originLocation = fromActivity.location!.trim();
    const destinationLocation = toActivity.location!.trim();
    const distanceMeters = getDistance(originLocation, destinationLocation);
    const durationSeconds = getDuration(originLocation, destinationLocation);
    optimizedDurationSeconds += durationSeconds;

    const entry = matrix.get(`${originLocation}:::${destinationLocation}`);
    segments.push({
      fromActivityId: fromActivity.id,
      toActivityId: toActivity.id,
      origin: originLocation,
      destination: destinationLocation,
      distance: { text: formatDistance(distanceMeters), value: distanceMeters },
      duration: {
        text: formatDuration(durationSeconds, lang),
        value: durationSeconds,
      },
      isEstimated: entry?.isEstimated,
      source: entry?.source,
    });
  }

  const reorderedActivities = bestRoute.map((originalIndex, newIndex) => {
    return {
      ...activitiesWithLocation[originalIndex],
      orderIndex: newIndex,
    };
  });

  const finalOptimizedActivities = [
    ...reorderedActivities,
    ...activitiesWithoutLocation.map((act, idx) => ({
      ...act,
      orderIndex: reorderedActivities.length + idx,
    })),
  ];

  const savedDistanceMeters = Math.max(
    0,
    originalDistanceMeters - bestDistance,
  );
  const savedDurationSeconds = Math.max(
    0,
    originalDurationSeconds - optimizedDurationSeconds,
  );
  const savedPercentage =
    originalDistanceMeters > 0
      ? Math.round((savedDistanceMeters / originalDistanceMeters) * 100)
      : 0;
  const isBetter = savedDistanceMeters > 200; // at least 200m saved

  return {
    originalActivities: activities,
    optimizedActivities: finalOptimizedActivities,
    originalDistanceMeters,
    optimizedDistanceMeters: bestDistance,
    originalDurationSeconds,
    optimizedDurationSeconds,
    savedDistanceMeters,
    savedPercentage,
    savedDurationSeconds,
    formattedOriginalDistance: formatDistance(originalDistanceMeters),
    formattedOptimizedDistance: formatDistance(bestDistance),
    formattedSavedDistance: formatDistance(savedDistanceMeters),
    formattedOriginalDuration: formatDuration(originalDurationSeconds, lang),
    formattedOptimizedDuration: formatDuration(optimizedDurationSeconds, lang),
    formattedSavedDuration: formatDuration(savedDurationSeconds, lang),
    isImprovement: isBetter,
    segments,
  };
}

export const getGoogleMapsDirectionsUrl = (
  origin: string,
  destination: string,
): string => {
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
    origin,
  )}&destination=${encodeURIComponent(destination)}&travelmode=driving`;
};
