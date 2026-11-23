'use client';

import { selectedSurface } from '@/base/theme/surfaces';

import { useEffect, useRef, useState } from 'react';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import { useTranslations } from 'next-intl';
import type { Map as MapInstance, Marker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import type { MapCoordinates, MapStop } from '@/base/types/maps';
import { getMapRouteSegments, getVietmapStyle } from '@/base/utils/maps';
import AppButton from './AppButton';

const MAP_LOAD_TIMEOUT_MS = 10_000;
export interface AppInteractiveMapProps {
  coordinates: MapCoordinates;
  title: string;
  stops?: MapStop[];
  selectedId?: string;
  onSelectStop?: (id: string) => void;
  fitVersion?: number;
  bottomInset?: number;
}

const AppInteractiveMap = ({
  coordinates, title, stops, selectedId, onSelectStop, fitVersion = 0, bottomInset = 0,
}: AppInteractiveMapProps) => {
  const theme = useTheme();
  const t = useTranslations('interactiveMap');
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapInstance | null>(null);
  const libraryRef = useRef<typeof import('maplibre-gl') | null>(null);
  const styleReadyRef = useRef(false);
  // Chỉ dùng làm tâm ban đầu: đổi stops không được tạo lại bản đồ.
  const initialCenterRef = useRef(coordinates);
  const markersRef = useRef<Array<{ id: string; marker: Marker }>>([]);
  const selectRef = useRef(onSelectStop);
  const [unavailable, setUnavailable] = useState(false);
  const [styleVersion, setStyleVersion] = useState(0);
  const pointsKey = JSON.stringify(stops ?? []);
  // Khung nhìn chỉ phụ thuộc vị trí các điểm, không phụ thuộc ngày nào đang được chọn.
  const fitKey = JSON.stringify((stops ?? []).map(({ id, coordinates: c }) => [id, c.latitude, c.longitude]));
  const routeColor = theme.palette.primary.main;

  useEffect(() => { selectRef.current = onSelectStop; }, [onSelectStop]);

  useEffect(() => {
    if (unavailable) return;
    let active = true;
    let map: MapInstance | undefined;
    let observer: ResizeObserver | undefined;
    let ready = false;
    const timers: Array<ReturnType<typeof setTimeout>> = [];

    const watchTimeout = () => timers.push(setTimeout(() => {
      if (active && !ready) showUnavailable();
    }, MAP_LOAD_TIMEOUT_MS));
    const showUnavailable = () => {
      if (active) setUnavailable(true);
    };

    const initialize = async () => {
      try {
        const style = getVietmapStyle();
        if (!style) {
          if (active) setUnavailable(true);
          return;
        }
        const library = await import('maplibre-gl');
        if (!active || !containerRef.current) return;
        libraryRef.current = library;
        library.setWorkerUrl(`${window.location.origin}/maplibre/maplibre-gl-worker.mjs`);
        map = new library.Map({
          container: containerRef.current,
          style,
          center: [initialCenterRef.current.longitude, initialCenterRef.current.latitude],
          zoom: 12,
          attributionControl: false,
          cooperativeGestures: true,
        });
        mapRef.current = map;
        map.addControl(new library.NavigationControl({ showCompass: false }), 'top-right');
        map.on('style.load', () => {
          ready = true;
          styleReadyRef.current = true;
          if (active) setStyleVersion((value) => value + 1);
        });
        // Chỉ báo lỗi tải bản đồ khi style chưa sẵn sàng hoặc key bị từ chối.
        map.on('error', (event) => {
          const status = (event.error as { status?: number } | undefined)?.status;
          if (!ready || status === 401 || status === 403) showUnavailable();
        });
        watchTimeout();
        observer = new ResizeObserver(() => map?.resize());
        observer.observe(containerRef.current);
      } catch {
        if (active) setUnavailable(true);
      }
    };
    void initialize();
    return () => {
      active = false;
      timers.forEach(clearTimeout);
      observer?.disconnect();
      markersRef.current.forEach(({ marker }) => marker.remove());
      markersRef.current = [];
      mapRef.current = null;
      styleReadyRef.current = false;
      map?.remove();
    };
  }, [unavailable]);

  useEffect(() => {
    const map = mapRef.current;
    const library = libraryRef.current;
    if (!map || !library || !styleReadyRef.current || unavailable) return;
    const drawStops = () => {
      markersRef.current.forEach(({ marker }) => marker.remove());
      const points: MapStop[] = JSON.parse(pointsKey);
      if (map.getLayer('itinerary-line')) map.removeLayer('itinerary-line');
      if (map.getSource('itinerary')) map.removeSource('itinerary');
      const segments = getMapRouteSegments(points.filter((point) => !point.dimmed));
      if (segments.length) {
        map.addSource('itinerary', {
          type: 'geojson',
          data: { type: 'Feature', properties: {}, geometry: { type: 'MultiLineString', coordinates: segments } },
        });
        map.addLayer({
          id: 'itinerary-line', type: 'line', source: 'itinerary',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: { 'line-color': routeColor, 'line-width': 4, 'line-opacity': 0.85 },
        });
      }
      markersRef.current = points.map((point) => {
        const element = document.createElement('button');
        element.type = 'button';
        element.className = 'itinerary-map-stop';
        // Điểm của ngày khác chỉ là chấm nhỏ, không có số để bản đồ bớt rối.
        element.textContent = point.dimmed ? '' : String(point.order);
        element.setAttribute('aria-label', `${point.order}. ${point.label}`);
        element.title = point.label;
        element.dataset.completed = String(Boolean(point.completed));
        element.dataset.dimmed = String(Boolean(point.dimmed));
        element.addEventListener('click', () => selectRef.current?.(point.id));
        const sameLocation = points.filter((other) =>
          other.coordinates.latitude === point.coordinates.latitude &&
          other.coordinates.longitude === point.coordinates.longitude);
        const duplicateIndex = sameLocation.findIndex((other) => other.id === point.id);
        const angle = duplicateIndex * 2 * Math.PI / sameLocation.length;
        const offset: [number, number] = sameLocation.length > 1
          ? [Math.cos(angle) * 24, Math.sin(angle) * 24] : [0, 0];
        const marker = new library.Marker({ element, offset })
          .setLngLat([point.coordinates.longitude, point.coordinates.latitude]).addTo(map);
        return { id: point.id, marker };
      });
    };
    drawStops();
  }, [pointsKey, styleVersion, routeColor, fitVersion, unavailable]);

  useEffect(() => {
    const map = mapRef.current;
    const library = libraryRef.current;
    if (!map || !library || !styleReadyRef.current || unavailable) return;
    const points: Array<[string, number, number]> = JSON.parse(fitKey);
    if (!points.length) return;
    const bounds = new library.LngLatBounds();
    points.forEach(([, latitude, longitude]) => bounds.extend([longitude, latitude]));
    const padding = bottomInset > 0 ? { top: 24, right: 48, left: 48,
      bottom: Math.min(bottomInset + 24, Math.max(24, map.getCanvas().clientHeight - 120)) } : 64;
    map.fitBounds(bounds, { padding, maxZoom: 14, duration: 0 });
  }, [fitKey, styleVersion, fitVersion, unavailable, bottomInset]);

  useEffect(() => {
    const map = mapRef.current;
    markersRef.current.forEach(({ id, marker }) => {
      const selected = id === selectedId;
      marker.getElement().setAttribute('aria-pressed', String(selected));
      if (selected && map) map.easeTo({ center: marker.getLngLat(), duration: 350 });
    });
  }, [selectedId, pointsKey, styleVersion, fitVersion]);

  if (unavailable) {
    return (
      <Stack spacing={2} role="status" sx={{ height: bottomInset > 0 ? `calc(100% - ${bottomInset}px)` : '100%',
        overflow: 'auto', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <Typography>{t('unavailable')}</Typography>
        <AppButton intent="secondary" onClick={() => setUnavailable(false)}>{t('retry')}</AppButton>
      </Stack>
    );
  }

  return (
    <Box ref={containerRef} role="region" aria-label={title} sx={{
      width: '100%', height: '100%', colorScheme: 'light',
      '& .itinerary-map-stop': {
        width: 44, height: 44, borderRadius: '50%', border: '3px solid',
        borderColor: 'background.paper', bgcolor: 'primary.main', color: 'primary.contrastText',
        fontSize: '16px', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit',
        boxShadow: theme.shadows[3], padding: 0,
        '&[data-completed="true"]': { bgcolor: 'success.main', color: 'success.contrastText' },
        '&[data-dimmed="true"]': { opacity: 0.55, width: 14, height: 14, borderWidth: '2px' },
        '&[data-dimmed="false"]': { zIndex: 1 },
        '&[aria-pressed="true"]': { ...selectedSurface(theme), zIndex: 1 },
        '&:focus-visible': { outline: '3px solid', outlineColor: 'primary.main', outlineOffset: 3 },
      },
    }} />
  );
};

export default AppInteractiveMap;
