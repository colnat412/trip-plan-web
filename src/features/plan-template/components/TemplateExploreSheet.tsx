"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import AddLocationAltOutlinedIcon from "@mui/icons-material/AddLocationAltOutlined";
import { useTranslations } from "next-intl";
import { AppButton } from "@/base/components/ui";
import { normalizeActivityCategory } from "@/base/constants";
import type { PlaceMapPin } from "@/base/components/ui/AppPlaceMap";
import useTemplateDetail from "../hooks/useTemplateDetail";
import useTemplateMap from "../hooks/useTemplateMap";
import TemplateItinerary from "./TemplateItinerary";
import {
  TemplateSaveProvider,
  TemplateSaveButton,
} from "./TemplateSaveControls";
import CopyTemplateDialog from "./CopyTemplateDialog";
import type { TemplatePlaceSeed } from "./AddTemplatePlaceDialog";
export interface TemplateActivityMapPin extends PlaceMapPin {
  order: number;
  activity: TemplatePlaceSeed;
}
interface SheetActivitySelection {
  version: number | undefined;
  dayNumber: number;
  index: number | null;
}
interface TemplateExploreSheetProps {
  templateId: string;
  visible?: boolean;
  selectedStopId: string;
  onClose: () => void;
  onSelectStop: (id: string) => void;
  onPanelInsetChange: (inset: number) => void;
  onStopsChange: (stops: TemplateActivityMapPin[]) => void;
  onRequestAdd: (place: TemplatePlaceSeed) => void;
}
export default function TemplateExploreSheet({
  templateId,
  visible = true,
  selectedStopId,
  onClose,
  onStopsChange,
  onRequestAdd,
  onSelectStop,
  onPanelInsetChange,
}: TemplateExploreSheetProps) {
  const t = useTranslations("planTemplate");
  const query = useTemplateDetail(templateId);
  const detail = query.detail;
  const [dayNumber, setDayNumber] = useState(1);
  const [activitySelection, setActivitySelection] =
    useState<SheetActivitySelection>({
      version: undefined,
      dayNumber: 1,
      index: null,
    });
  const [copyOpen, setCopyOpen] = useState(false);
  const panel = useRef<HTMLElement>(null);
  const changeDay = useCallback((value: number) => {
    setDayNumber(value);
  }, []);
  useEffect(() => {
    const node = panel.current;
    if (!node || !visible) {
      onPanelInsetChange(0);
      return;
    }
    const report = () =>
      onPanelInsetChange(
        Math.max(0, window.innerHeight - node.getBoundingClientRect().top),
      );
    const observer = new ResizeObserver(report);
    observer.observe(node);
    window.addEventListener("resize", report);
    report();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", report);
      onPanelInsetChange(0);
    };
  }, [onPanelInsetChange, visible]);
  const map = useTemplateMap(
    detail ? templateId : "",
    dayNumber,
    detail?.template.contentVersion,
  );
  const { hasNextPage, isFetching, isFetchingNextPage, error, fetchNextPage } =
    map;
  useEffect(() => {
    if (detail && hasNextPage && !isFetching && !isFetchingNextPage && !error)
      void fetchNextPage();
  }, [
    detail,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    error,
    fetchNextPage,
  ]);
  const currentVersion = detail?.template.contentVersion;
  const day = detail?.snapshot.days.find(
    (item) => item.dayNumber === dayNumber,
  );
  const pins = useMemo<TemplateActivityMapPin[]>(
    () =>
      map.stops.flatMap((stop) => {
        const activity = day?.activities[stop.order - 1];
        return activity?.location
          ? [
              {
                id: `${templateId}:${currentVersion ?? 0}:${stop.id}`,
                title: activity.title,
                order: stop.order,
                ...stop.coordinates,
                activity: {
                  title: activity.title,
                  location: activity.location,
                  category: normalizeActivityCategory(activity.category),
                },
              },
            ]
          : [];
      }),
    [map.stops, day, templateId, currentVersion],
  );
  const pinsKey = JSON.stringify(pins);
  useEffect(() => {
    onStopsChange(JSON.parse(pinsKey));
  }, [pinsKey, onStopsChange]);
  useEffect(() => () => onStopsChange([]), [onStopsChange]);
  const chosen = pins.find((pin) => pin.id === selectedStopId);
  const selectedIndex = chosen
    ? chosen.order - 1
    : activitySelection.version === currentVersion &&
        activitySelection.dayNumber === dayNumber
      ? activitySelection.index
      : null;
  const selectedActivity =
    selectedIndex != null ? day?.activities[selectedIndex] : null;
  const selectedSeed = selectedActivity?.location
    ? {
        title: selectedActivity.title,
        location: selectedActivity.location,
        category: normalizeActivityCategory(selectedActivity.category),
      }
    : null;
  return (
    <Stack
      ref={panel}
      component="section"
      hidden={!visible}
      inert={!visible}
      aria-label={detail?.template.title ?? t("itinerary")}
      aria-busy={map.isFetching || map.isFetchingNextPage || undefined}
      sx={{
        display: visible ? "flex" : "none",
        width: "100%",
        minWidth: 0,
        bgcolor: "background.paper",
        borderRadius: "var(--app-radius-panel)",
        maxHeight: { xs: "56dvh", md: "65dvh" },
        minHeight: 0,
        overflow: "hidden",
        boxShadow: 3,
        pointerEvents: "auto",
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        useFlexGap
        sx={{
          alignItems: "center",
          minWidth: 0,
          flexShrink: 0,
          px: 1.5,
          py: 0.5,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Typography
          component="h2"
          sx={{
            fontWeight: 700,
            flex: 1,
            minWidth: 0,
            fontSize: 15,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {detail?.template.title ?? t("itinerary")}
        </Typography>
        {detail && (
          <TemplateSaveProvider ids={[templateId]}>
            <TemplateSaveButton
              id={templateId}
              likeCount={detail.template.likeCount}
              iconOnly
            />
          </TemplateSaveProvider>
        )}
        <IconButton
          component={Link}
          href={`/templates/${templateId}?from=explore`}
          aria-label={t("openFullDetail")}
          sx={{ width: 44, height: 44 }}
        >
          <OpenInNewRoundedIcon fontSize="small" />
        </IconButton>
        <IconButton
          aria-label={t("closePlanSheet")}
          onClick={onClose}
          sx={{ width: 44, height: 44 }}
        >
          <CloseRoundedIcon />
        </IconButton>
      </Stack>
      {selectedSeed && (
        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          sx={{
            p: 1.5,
            alignItems: "center",
            flexWrap: "wrap",
            minWidth: 0,
            flexShrink: 0,
            bgcolor: "action.hover",
          }}
        >
          <Typography
            variant="body2"
            sx={{ flex: 1, minWidth: 0, overflowWrap: "anywhere" }}
          >
            {selectedSeed.title}
          </Typography>
          <AppButton
            intent="primary"
            size="small"
            aria-label={t("addPlaceToTrip")}
            startIcon={<AddLocationAltOutlinedIcon />}
            onClick={() => onRequestAdd(selectedSeed)}
          >
            {t("addPlaceShort")}
          </AppButton>
        </Stack>
      )}
      <Stack
        spacing={1.5}
        useFlexGap
        sx={{
          p: 1.5,
          overflowY: "auto",
          flex: "1 1 auto",
          minHeight: 0,
          overscrollBehavior: "contain",
        }}
      >
        {!detail && !query.error && (
          <Box role="status">
            <CircularProgress size={24} />
          </Box>
        )}
        {query.error && (
          <Stack spacing={1} useFlexGap>
            <Typography variant="body2">
              {t("templateSheetUnavailable")}
            </Typography>
            <AppButton
              intent="secondary"
              onClick={() => void query.refetch().catch(() => undefined)}
            >
              {t("retry")}
            </AppButton>
          </Stack>
        )}
        {detail && (
          <>
            <Stack spacing={0.5} useFlexGap sx={{ minWidth: 0, flexShrink: 0 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                title={detail.template.destination}
                sx={{
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflowWrap: "anywhere",
                }}
              >
                {detail.template.destination}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t("durationNightsLabel", {
                  days: detail.template.durationDays,
                  nights: Math.max(0, detail.template.durationDays - 1),
                })}
              </Typography>
            </Stack>
            {map.error?.status === 409 && (
              <Typography variant="caption" color="text.secondary">
                {t("versionChanged")}
              </Typography>
            )}
            {map.error && (
              <AppButton
                intent="text"
                size="small"
                onClick={() => {
                  if (map.error?.status === 409)
                    void query.refetch().catch(() => undefined);
                  else void map.refetch();
                }}
              >
                {t("retry")}
              </AppButton>
            )}
            <TemplateItinerary
              snapshot={detail.snapshot}
              currency={detail.template.currency}
              showMap={false}
              compactActions
              onDayChange={changeDay}
              selectedActivityIndex={selectedIndex ?? undefined}
              onSelectActivity={(index) => {
                setActivitySelection({
                  version: currentVersion,
                  dayNumber,
                  index,
                });
                const pin = pins.find((item) => item.order === index + 1);
                onSelectStop(pin?.id ?? "");
              }}
              onChoosePlace={(activity) =>
                onRequestAdd({
                  title: activity.title,
                  location: activity.location ?? undefined,
                  category: normalizeActivityCategory(activity.category),
                })
              }
            />
          </>
        )}
      </Stack>
      {detail && (
        <Box
          sx={{ p: 1.5, flexShrink: 0, borderTop: 1, borderColor: "divider" }}
        >
          <AppButton
            fullWidth
            intent="secondary"
            startIcon={<ContentCopyRoundedIcon />}
            aria-label={t("copyItineraryLabel")}
            onClick={() => setCopyOpen(true)}
          >
            {t("copyItinerary")}
          </AppButton>
        </Box>
      )}
      {detail && (
        <CopyTemplateDialog
          template={detail.template}
          open={copyOpen}
          onClose={() => setCopyOpen(false)}
        />
      )}
    </Stack>
  );
}
