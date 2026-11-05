'use client';

import { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import type { Map as MapInstance, StyleSpecification } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import type { MapCoordinates } from '@/base/types/maps';
import { getOsmEmbedUrl, getVietmapStyleUrl } from '@/base/utils/maps';

const MAP_LOAD_TIMEOUT_MS = 10_000;

const osmStyle: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      maxzoom: 19,
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a>',
    },
  },
  layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
};

export interface AppInteractiveMapProps {
  coordinates: MapCoordinates;
  title: string;
}

const AppInteractiveMap = ({ coordinates, title }: AppInteractiveMapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [useIframe, setUseIframe] = useState(false);

  useEffect(() => {
    if (useIframe) return;

    let isActive = true;
    let map: MapInstance | undefined;
    let resizeObserver: ResizeObserver | undefined;
    let usingVietmap = false;
    let hasLoaded = false;
    const timeoutIds: Array<ReturnType<typeof setTimeout>> = [];

    function showFallbackMap() {
      if (!isActive || !map) return;

      if (usingVietmap) {
        usingVietmap = false;
        hasLoaded = false;
        map.setStyle(osmStyle);
        timeoutIds.push(
          setTimeout(() => {
            if (isActive && !hasLoaded) setUseIframe(true);
          }, MAP_LOAD_TIMEOUT_MS),
        );
      } else {
        setUseIframe(true);
      }
    }

    async function initializeMap() {
      try {
        const mapLibrary = await import('maplibre-gl');
        if (!isActive || !containerRef.current) return;

        const vietmapStyleUrl = getVietmapStyleUrl();
        usingVietmap = Boolean(vietmapStyleUrl);
        map = new mapLibrary.Map({
          container: containerRef.current,
          style: vietmapStyleUrl || osmStyle,
          center: [coordinates.longitude, coordinates.latitude],
          zoom: 13,
          attributionControl: false,
        });
        map.addControl(
          new mapLibrary.AttributionControl({ compact: false }),
          'bottom-right',
        );
        map.addControl(
          new mapLibrary.NavigationControl({ showCompass: false }),
          'top-right',
        );
        new mapLibrary.Marker()
          .setLngLat([coordinates.longitude, coordinates.latitude])
          .addTo(map);

        map.on('error', showFallbackMap);
        map.on('idle', () => {
          hasLoaded = true;
        });
        timeoutIds.push(
          setTimeout(() => {
            if (isActive && !hasLoaded) showFallbackMap();
          }, MAP_LOAD_TIMEOUT_MS),
        );
        resizeObserver = new ResizeObserver(() => map?.resize());
        resizeObserver.observe(containerRef.current);
      } catch {
        if (isActive) setUseIframe(true);
      }
    }

    void initializeMap();

    return () => {
      isActive = false;
      timeoutIds.forEach(clearTimeout);
      resizeObserver?.disconnect();
      map?.remove();
    };
  }, [coordinates.latitude, coordinates.longitude, useIframe]);

  if (useIframe) {
    return (
      <Box
        component="iframe"
        src={getOsmEmbedUrl(coordinates.latitude, coordinates.longitude)}
        title={title}
        loading="lazy"
        sx={{ width: '100%', height: '100%', border: 0 }}
      />
    );
  }

  return (
    <Box
      ref={containerRef}
      role="region"
      aria-label={title}
      sx={{ width: '100%', height: '100%', colorScheme: 'light' }}
    />
  );
};

export default AppInteractiveMap;
