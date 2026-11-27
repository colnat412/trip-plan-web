"use client";
import { useEffect, useRef, useState } from "react";
import { Box, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useTranslations } from "next-intl";
import type { Map as MapInstance, GeoJSONSource, Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { MapCoordinates } from "@/base/types/maps";
import { getVietmapStyle } from "@/base/utils/maps";
import AppButton from "./AppButton";

export interface PlaceMapPin extends MapCoordinates {
  id: string;
  title: string;
}
export interface PlaceMapBounds {
  west: number;
  south: number;
  east: number;
  north: number;
}
export interface AppPlaceMapProps {
  pins: PlaceMapPin[];
  fitVersion?: number;
  focusVersion?: number;
  bottomInset?: number;
  selected?: PlaceMapPin | null;
  onSelect?: (id: string) => void;
  onBoundsChange?: (bounds: PlaceMapBounds) => void;
  onPick?: (coordinates: MapCoordinates) => void;
  picked?: MapCoordinates | null;
}
// A dedicated clustered layer avoids itinerary numbering/route lines and keeps existing consumers intact.
export default function AppPlaceMap({
  pins,
  fitVersion = 0,
  focusVersion,
  bottomInset = 0,
  selected,
  onSelect,
  onBoundsChange,
  onPick,
  picked,
}: AppPlaceMapProps) {
  const t = useTranslations("interactiveMap");
  const theme = useTheme();
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapInstance | null>(null);
  const callbacks = useRef({ onSelect, onBoundsChange, onPick });
  const focusState = useRef<{
    token: string | number | null;
    inset: number;
    time: number;
  }>({ token: focusVersion ?? null, inset: 0, time: 0 });
  const markerRef = useRef<Marker | null>(null);
  const popupRef = useRef<import("maplibre-gl").Popup | null>(null);
  const [ready, setReady] = useState(0);
  const [failed, setFailed] = useState(false);
  const color = theme.palette.primary.main;
  useEffect(() => {
    callbacks.current = { onSelect, onBoundsChange, onPick };
  });
  useEffect(() => {
    if (failed) return;
    let active = true;
    let map: MapInstance | undefined;
    let observer: ResizeObserver | undefined;
    let loaded = false;
    const timer = setTimeout(() => {
      if (active && !loaded) setFailed(true);
    }, 10000);
    const start = async () => {
      try {
        const style = getVietmapStyle();
        if (!style) {
          if (active) setFailed(true);
          return;
        }
        const library = await import("maplibre-gl");
        if (!active || !container.current) return;
        library.setWorkerUrl(
          `${window.location.origin}/maplibre/maplibre-gl-worker.mjs`,
        );
        map = new library.Map({
          container: container.current,
          style,
          center: [106, 16],
          zoom: 4.5,
          attributionControl: false,
        });
        mapRef.current = map;
        map.addControl(
          new library.AttributionControl({ compact: true }),
          "bottom-right",
        );
        const reportBounds = () => {
          if (!map) return;
          const bounds = map.getBounds();
          // Wrapping longitudes keeps requests valid after panning across the dateline.
          const wrap = (n: number) => ((((n + 180) % 360) + 360) % 360) - 180;
          const entireWorld = bounds.getEast() - bounds.getWest() >= 360;
          callbacks.current.onBoundsChange?.({
            west: entireWorld ? -180 : wrap(bounds.getWest()),
            east: entireWorld ? 180 : wrap(bounds.getEast()),
            south: Math.max(-90, bounds.getSouth()),
            north: Math.min(90, bounds.getNorth()),
          });
        };
        map.on("load", () => {
          if (!active || !map) return;
          loaded = true;
          clearTimeout(timer);
          map.addSource("places", {
            type: "geojson",
            data: { type: "FeatureCollection", features: [] },
            cluster: true,
            clusterRadius: 46,
            clusterMaxZoom: 15,
          });
          map.addLayer({
            id: "clusters",
            type: "circle",
            source: "places",
            filter: ["has", "point_count"],
            paint: {
              "circle-color": color,
              "circle-radius": 22,
              "circle-stroke-color": "#ffffff",
              "circle-stroke-width": 2,
            },
          });
          map.addLayer({
            id: "cluster-count",
            type: "symbol",
            source: "places",
            filter: ["has", "point_count"],
            layout: {
              "text-field": ["get", "point_count_abbreviated"],
              "text-size": 13,
              "text-font": ["sans-serif"],
            },
            paint: { "text-color": "#ffffff" },
          });
          map.addLayer({
            id: "place-pins",
            type: "circle",
            source: "places",
            filter: ["!", ["has", "point_count"]],
            paint: {
              "circle-color": color,
              "circle-radius": 12,
              "circle-stroke-color": "#ffffff",
              "circle-stroke-width": 3,
            },
          });
          // Transparent hit layer provides a 44px target around each visible pin.
          map.addLayer({
            id: "place-hit",
            type: "circle",
            source: "places",
            filter: ["!", ["has", "point_count"]],
            paint: { "circle-radius": 22, "circle-opacity": 0 },
          });
          setReady((value) => value + 1);
          reportBounds();
        });
        map.on("moveend", reportBounds);
        const showChoices = (
          choices: PlaceMapPin[],
          center: [number, number],
        ) => {
          if (!map || !active) return;
          const group = document.createElement("div");
          group.setAttribute("role", "group");
          group.setAttribute("aria-label", t("mapLabel"));
          for (const choice of choices) {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "place-map-choice";
            button.textContent = choice.title;
            button.addEventListener("click", () => {
              callbacks.current.onSelect?.(choice.id);
              popupRef.current?.remove();
            });
            group.appendChild(button);
          }
          popupRef.current?.remove();
          popupRef.current = new library.Popup({
            maxWidth: "280px",
            closeButton: true,
          })
            .setLngLat(center)
            .setDOMContent(group)
            .addTo(map);
        };
        map.on("click", async (event) => {
          if (!map || !loaded) return;
          const features = map.queryRenderedFeatures(event.point, {
            layers: ["clusters", "place-hit"],
          });
          const feature = features[0];
          if (!feature) {
            callbacks.current.onPick?.({
              latitude: event.lngLat.lat,
              longitude: event.lngLat.wrap().lng,
            });
            return;
          }
          if (
            feature.properties.cluster_id != null &&
            feature.geometry.type === "Point"
          ) {
            try {
              const zoom = await (
                map.getSource("places") as GeoJSONSource
              ).getClusterExpansionZoom(Number(feature.properties.cluster_id));
              if (zoom > 15) {
                const leaves = await (
                  map.getSource("places") as GeoJSONSource
                ).getClusterLeaves(
                  Number(feature.properties.cluster_id),
                  Number(feature.properties.point_count),
                  0,
                );
                const choices: PlaceMapPin[] = leaves.flatMap((leaf) =>
                  leaf.geometry.type === "Point"
                    ? [
                        {
                          id: String(leaf.properties?.id),
                          title: String(leaf.properties?.title ?? ""),
                          longitude: leaf.geometry.coordinates[0],
                          latitude: leaf.geometry.coordinates[1],
                        },
                      ]
                    : [],
                );
                showChoices(
                  choices,
                  feature.geometry.coordinates as [number, number],
                );
                return;
              }
              if (active)
                map.easeTo({
                  center: feature.geometry.coordinates as [number, number],
                  zoom,
                  duration: window.matchMedia(
                    "(prefers-reduced-motion: reduce)",
                  ).matches
                    ? 0
                    : 200,
                });
            } catch {
              /* Source can disappear when the map unmounts. */
            }
          } else if (features.length > 1 && feature.geometry.type === "Point") {
            showChoices(
              features.flatMap((item) =>
                item.geometry.type === "Point" && item.properties.id != null
                  ? [
                      {
                        id: String(item.properties.id),
                        title: String(item.properties.title ?? ""),
                        longitude: item.geometry.coordinates[0],
                        latitude: item.geometry.coordinates[1],
                      },
                    ]
                  : [],
              ),
              feature.geometry.coordinates as [number, number],
            );
          } else callbacks.current.onSelect?.(String(feature.properties.id));
        });
        map.on("error", (event) => {
          const status = (event.error as { status?: number })?.status;
          if (active && (!loaded || status === 401 || status === 403))
            setFailed(true);
        });
        observer = new ResizeObserver(() => map?.resize());
        observer.observe(container.current);
      } catch {
        if (active) setFailed(true);
      }
    };
    void start();
    return () => {
      active = false;
      clearTimeout(timer);
      observer?.disconnect();
      markerRef.current?.remove();
      popupRef.current?.remove();
      markerRef.current = null;
      mapRef.current = null;
      map?.remove();
    };
    // Map lifetime is independent of selections and data changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [failed]);
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready || failed) return;
    popupRef.current?.remove();
    (map.getSource("places") as GeoJSONSource | undefined)?.setData({
      type: "FeatureCollection",
      features: pins.map((pin) => ({
        type: "Feature",
        properties: { id: pin.id, title: pin.title },
        geometry: { type: "Point", coordinates: [pin.longitude, pin.latitude] },
      })),
    });
    if (map.getLayer("place-pins"))
      map.setPaintProperty("place-pins", "circle-color", color);
    if (map.getLayer("clusters"))
      map.setPaintProperty("clusters", "circle-color", color);
  }, [pins, ready, color, failed]);
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready || failed || !fitVersion || !pins.length) return;
    const longitudes = pins.map((pin) => pin.longitude),
      latitudes = pins.map((pin) => pin.latitude);
    map.fitBounds(
      [
        [Math.min(...longitudes), Math.min(...latitudes)],
        [Math.max(...longitudes), Math.max(...latitudes)],
      ],
      {
        padding: {
          top: Math.min(88, map.getCanvas().clientHeight / 4),
          bottom: Math.min(180, map.getCanvas().clientHeight / 3),
          left: 40,
          right: 40,
        },
        maxZoom: 12,
        duration: reducedMotion ? 0 : 200,
      },
    );
  }, [fitVersion, pins, ready, failed, reducedMotion]);
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready || failed) return;
    let active = true;
    const point = picked ?? selected;
    markerRef.current?.remove();
    markerRef.current = null;
    if (point) {
      void import("maplibre-gl").then((library) => {
        if (!active) return;
        markerRef.current = new library.Marker({ color })
          .setLngLat([point.longitude, point.latitude])
          .addTo(map);
        const now = Date.now();
        const token = focusVersion ?? `${point.latitude}:${point.longitude}`;
        const previous = focusState.current;
        const newFocus = token !== previous.token;
        const adjustNewSelection =
          bottomInset > previous.inset && now - previous.time < 900;
        if (selected && !picked && (newFocus || adjustNewSelection)) {
          map.easeTo({
            center: [point.longitude, point.latitude],
            zoom: Math.max(map.getZoom(), 13),
            duration: reducedMotion ? 0 : 200,
            offset: [
              0,
              -Math.min(
                bottomInset,
                Math.max(0, map.getCanvas().clientHeight - 160),
              ) / 2,
            ],
          });
        }
        focusState.current = {
          token,
          inset: bottomInset,
          time: newFocus ? now : previous.time,
        };
      });
    }
    return () => {
      active = false;
    };
  }, [
    picked,
    selected,
    ready,
    failed,
    color,
    reducedMotion,
    bottomInset,
    focusVersion,
  ]);
  if (failed)
    return (
      <Stack
        role="status"
        sx={{
          flex: 1,
          p: 2,
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Typography>{t("unavailable")}</Typography>
        <AppButton intent="secondary" onClick={() => setFailed(false)}>
          {t("retry")}
        </AppButton>
      </Stack>
    );
  return (
    <Box
      ref={container}
      role="region"
      aria-label={t("mapLabel")}
      sx={{
        flex: 1,
        width: "100%",
        height: "100%",
        minHeight: 0,
        colorScheme: "light",
        "& .maplibregl-popup-content": {
          bgcolor: "background.paper",
          color: "text.primary",
          borderRadius: "var(--app-radius-card)",
          p: 1,
          pt: 5.5,
          boxShadow: 3,
        },
        "& .maplibregl-popup-close-button": {
          width: 44,
          height: 44,
          color: "text.primary",
        },
        "& .place-map-choice": {
          display: "block",
          width: "100%",
          minHeight: 44,
          border: 0,
          p: 1.5,
          textAlign: "left",
          fontFamily: "inherit",
          fontSize: 14,
          color: "inherit",
          bgcolor: "transparent",
          borderRadius: "var(--app-radius-control)",
          cursor: "pointer",
          overflowWrap: "anywhere",
          "&:hover": { bgcolor: "action.hover" },
          "&:focus-visible": {
            outline: "2px solid",
            outlineColor: "primary.main",
          },
        },
      }}
    />
  );
}
