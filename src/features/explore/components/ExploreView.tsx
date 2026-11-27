"use client";
import { useMemo, useState } from "react";
import {
  Box,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AddLocationAltOutlinedIcon from "@mui/icons-material/AddLocationAltOutlined";
import { useTranslations } from "next-intl";
import { AppButton } from "@/base/components/ui";
import AppPlaceMap, {
  type PlaceMapPin,
} from "@/base/components/ui/AppPlaceMap";
import type { MapCoordinates, MapPlacePrediction } from "@/base/types/maps";
import TemplateExploreSheet, {
  type TemplateActivityMapPin,
} from "@/features/plan-template/components/TemplateExploreSheet";
import AddTemplatePlaceDialog, {
  type TemplatePlaceSeed,
} from "@/features/plan-template/components/AddTemplatePlaceDialog";
import useExplorePlaces from "../hooks/useExplorePlaces";
import useExploreMapSearch from "../hooks/useExploreMapSearch";
import type { ExploreItinerary, ExploreMapSelection } from "../types";
import ExploreMapSearch from "./ExploreMapSearch";
import PublishedTripPicker from "./PublishedTripPicker";
export default function ExploreView() {
  const t = useTranslations("explore");
  const model = useExplorePlaces();
  const search = useExploreMapSearch();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [publishedVisible, setPublishedVisible] = useState(true);
  const [dayPins, setDayPins] = useState<TemplateActivityMapPin[]>([]);
  const [selectedStopId, setSelectedStopId] = useState("");
  const [panelInset, setPanelInset] = useState(0);
  const [focusVersion, setFocusVersion] = useState(0);
  const [tripFocus, setTripFocus] = useState<PlaceMapPin | null>(null);
  const [pickedPlace, setPickedPlace] = useState<ExploreMapSelection | null>(
    null,
  );
  const [placeCardOpen, setPlaceCardOpen] = useState(false);
  const [placeToAdd, setPlaceToAdd] = useState<TemplatePlaceSeed | null>(null);
  const place = search.chosen ? search.selection : pickedPlace;
  const seed = search.chosen
    ? {
        title: search.chosen.mainText || search.chosen.description,
        location: search.chosen.description || search.chosen.mainText,
        category: "OTHER" as const,
      }
    : pickedPlace?.activity;
  const pins = useMemo(() => {
    const visible = publishedVisible
      ? model.selected
        ? dayPins
        : model.pins
      : [];
    return place && !visible.some((pin) => pin.id === place.id)
      ? [...visible, place]
      : visible;
  }, [publishedVisible, model.selected, dayPins, model.pins, place]);
  const chooseTrip = (trip: ExploreItinerary) => {
    if (model.selected?.id === trip.id) {
      setPublishedVisible(true);
      setSheetOpen(true);
      setPlaceCardOpen(false);
      return;
    }
    model.setSelectedId(trip.id);
    setPublishedVisible(true);
    setSheetOpen(true);
    setSelectedStopId("");
    setPickedPlace(null);
    setPlaceCardOpen(false);
    search.clear();
    setTripFocus(
      trip.latitude !== null && trip.longitude !== null
        ? {
            id: trip.id,
            title: trip.title,
            latitude: trip.latitude,
            longitude: trip.longitude,
          }
        : null,
    );
    setFocusVersion((value) => value + 1);
  };
  const choosePrediction = (prediction: MapPlacePrediction) => {
    setPickedPlace(null);
    setPlaceCardOpen(true);
    setSheetOpen(false);
    search.choose(prediction);
    setFocusVersion((value) => value + 1);
  };
  const selectPin = (id: string) => {
    if (place?.id === id) {
      setPlaceCardOpen(true);
      return;
    }
    const stop = dayPins.find((pin) => pin.id === id);
    if (stop && model.selected) {
      setSelectedStopId(id);
      search.clear();
      setPickedPlace({
        ...stop,
        description: stop.activity.location ?? "",
        activity: stop.activity,
      });
      setPlaceCardOpen(!sheetOpen);
      setFocusVersion((value) => value + 1);
      return;
    }
    const trip = model.items.find((item) => item.id === id);
    if (trip) chooseTrip(trip);
  };
  const pickPosition = (coordinates: MapCoordinates) => {
    const location = `${coordinates.latitude.toFixed(6)}, ${coordinates.longitude.toFixed(6)}`;
    search.clear();
    setSheetOpen(false);
    setPlaceCardOpen(true);
    setPickedPlace({
      id: `position:${location}`,
      title: t("pickedPosition"),
      description: location,
      ...coordinates,
      activity: { title: t("pickedPosition"), location, category: "OTHER" },
    });
  };
  const selection = search.chosen
    ? search.selection
    : (pickedPlace ?? (publishedVisible ? tripFocus : null));
  return (
    <Box
      sx={{
        flex: "1 1 0",
        minHeight: 0,
        position: "relative",
        isolation: "isolate",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          "& .maplibregl-ctrl-bottom-right": {
            bottom: "calc(var(--app-bottom-navigation-space, 0px) + 8px)",
          },
        }}
      >
        <AppPlaceMap
          pins={pins}
          selected={selection}
          focusVersion={focusVersion}
          bottomInset={sheetOpen && publishedVisible && !pickerOpen ? panelInset : 0}
          onSelect={selectPin}
          onPick={pickPosition}
          onBoundsChange={model.setViewport}
        />
      </Box>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: { xs: 0, md: "auto" },
          width: { md: 440 },
          p: 1.5,
          pt: "calc(12px + env(safe-area-inset-top, 0px))",
        }}
      >
        <Stack direction="row" spacing={1} useFlexGap sx={{ alignItems: "flex-start", minWidth: 0 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <ExploreMapSearch
              model={search}
              onChoose={choosePrediction}
              onInput={(text) => {
                if (search.selection) setPickedPlace(search.selection);
                setPlaceCardOpen(false);
                search.changeSearch(text);
              }}
            />
          </Box>
          <Box sx={{ width: "42%", maxWidth: 176, flexShrink: 0, minWidth: 0 }}>
            <PublishedTripPicker
              model={model}
              onOpenChange={setPickerOpen}
              layerVisible={publishedVisible}
              onChoose={chooseTrip}
              onToggleLayer={() => {
                setPublishedVisible((value) => !value);
                setSheetOpen(false);
              }}
              onClear={() => {
                model.setSelectedId(null);
                model.changeSearch("");
                setSheetOpen(false);
                setTripFocus(null);
              }}
            />
          </Box>
        </Stack>
      </Box>
      <Stack
        spacing={1}
        useFlexGap
        sx={{
          position: "absolute",
          bottom: "calc(var(--app-bottom-navigation-space, 0px) + 12px)",
          left: 12,
          right: { xs: 12, md: "auto" },
          width: { md: 408 },
          maxHeight:
            "calc(100% - 144px - var(--app-bottom-navigation-space, 0px) - env(safe-area-inset-top, 0px))",
          minWidth: 0,
          pointerEvents: "none",
        }}
      >
        {model.selected && (
          <TemplateExploreSheet
            key={model.selected.id}
            templateId={model.selected.id}
            visible={sheetOpen && publishedVisible && !pickerOpen}
            selectedStopId={selectedStopId}
            onStopsChange={setDayPins}
            onPanelInsetChange={setPanelInset}
            onSelectStop={(id) => {
              setSelectedStopId(id);
              const stop = dayPins.find((pin) => pin.id === id);
              if (stop) {
                search.clear();
                setPickedPlace({
                  ...stop,
                  description: stop.activity.location ?? "",
                  activity: stop.activity,
                });
                setFocusVersion((value) => value + 1);
              }
            }}
            onRequestAdd={setPlaceToAdd}
            onClose={() => setSheetOpen(false)}
          />
        )}
        {placeCardOpen && seed && !(sheetOpen && publishedVisible) && (
          <Stack
            spacing={1}
            useFlexGap
            sx={{
              p: 1.5,
              bgcolor: "background.paper",
              borderRadius: "var(--app-radius-card)",
              minWidth: 0,
              maxHeight: "35dvh",
              overflowY: "auto",
              pointerEvents: "auto",
              boxShadow: 3,
            }}
          >
            <Stack
              direction="row"
              sx={{ alignItems: "flex-start", minWidth: 0 }}
            >
              <Stack spacing={0.5} useFlexGap sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    overflowWrap: "anywhere",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {seed.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ overflowWrap: "anywhere" }}
                >
                  {seed.location}
                </Typography>
              </Stack>
              <IconButton
                aria-label={t("closePlace")}
                onClick={() => setPlaceCardOpen(false)}
                sx={{ width: 44, height: 44, flexShrink: 0 }}
              >
                <CloseRoundedIcon />
              </IconButton>
            </Stack>
            {search.resolving && <CircularProgress size={18} />}
            <AppButton
              intent="primary"
              startIcon={<AddLocationAltOutlinedIcon />}
              onClick={() => setPlaceToAdd(seed)}
            >
              {t("addToCurrentPlan")}
            </AppButton>
          </Stack>
        )}
      </Stack>
      {placeToAdd && (
        <AddTemplatePlaceDialog
          place={placeToAdd}
          onClose={() => setPlaceToAdd(null)}
        />
      )}
    </Box>
  );
}
