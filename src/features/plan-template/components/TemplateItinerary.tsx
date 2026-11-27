"use client";

import { useEffect, useRef, useState } from "react";
import { Stack, Typography, useMediaQuery } from "@mui/material";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import { useTranslations } from "next-intl";
import { AppCard, AppEmptyState, AppSectionHeader } from "@/base/components/ui";
import { normalizeActivityCategory } from "@/base/constants";
import PlanDayTabs from "@/features/plan/components/PlanDayTabs";
import ActivityTimelineCard from "@/features/plan/components/ActivityTimelineCard";
import TemplateMap from "./TemplateMap";
import { AppButton } from "@/base/components/ui";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import type { TemplateSnapshot } from "../types";

interface TemplateItineraryProps {
  snapshot: TemplateSnapshot;
  currency: string;
  templateId?: string;
  templateVersion?: number;
  onRefreshTemplate?: () => void;
  showMap?: boolean;
  compactActions?: boolean;
  selectedActivityIndex?: number;
  onSelectActivity?: (index: number) => void;
  onDayChange?: (dayNumber: number) => void;
  onChoosePlace?: (
    activity: TemplateSnapshot["days"][number]["activities"][number],
  ) => void;
}

const TemplateItinerary = ({
  snapshot,
  currency,
  templateId,
  templateVersion,
  onRefreshTemplate,
  showMap = true,
  compactActions = false,
  selectedActivityIndex,
  onSelectActivity,
  onDayChange,
  onChoosePlace,
}: TemplateItineraryProps) => {
  const t = useTranslations("planTemplate");
  const root = useRef<HTMLDivElement>(null);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [selectedDayId, setSelectedDayId] = useState("");
  const days = snapshot.days.map((day) => ({
    ...day,
    id: String(day.dayNumber),
    totalActivities: day.activities.length,
  }));
  const selectedDay = days.find((day) => day.id === selectedDayId) ?? days[0];
  const dayLabel = selectedDay
    ? t("day", { number: selectedDay.dayNumber })
    : "";
  const dayTitle = selectedDay?.title?.trim() ?? "";
  const normalizedTitle = dayTitle.replace(/\s+/g, " ").toLocaleLowerCase();
  const isDefaultTitle =
    selectedDay &&
    [
      dayLabel,
      `Ngày ${selectedDay.dayNumber}`,
      `Day ${selectedDay.dayNumber}`,
    ].some((label) => label.toLocaleLowerCase() === normalizedTitle);

  const currentDayNumber = selectedDay?.dayNumber;
  useEffect(() => {
    if (currentDayNumber) onDayChange?.(currentDayNumber);
  }, [currentDayNumber, onDayChange]);

  useEffect(() => {
    if (selectedActivityIndex == null) return;
    root.current
      ?.querySelector(`[data-template-activity="${selectedActivityIndex}"]`)
      ?.scrollIntoView({
        block: "nearest",
        behavior: reducedMotion ? "auto" : "smooth",
      });
  }, [selectedActivityIndex, currentDayNumber, reducedMotion]);

  return (
    <Stack
      ref={root}
      spacing={2}
      sx={{ minWidth: 0, overflowWrap: "anywhere" }}
    >
      <AppSectionHeader title={t("itinerary")} />
      {selectedDay && (
        <>
          <PlanDayTabs
            days={days}
            selectedDayId={selectedDay.id}
            onSelectDay={setSelectedDayId}
          />
          {templateId && showMap && (
            <TemplateMap
              key={`${templateId}:${selectedDay.dayNumber}`}
              templateId={templateId}
              dayNumber={selectedDay.dayNumber}
              contentVersion={templateVersion}
              onRefreshTemplate={onRefreshTemplate}
            />
          )}
          <AppCard
            component="section"
            sx={{
              minWidth: 0,
              p: { xs: 2, md: 3 },
              borderRadius: "var(--app-radius-card)",
            }}
          >
            <Stack spacing={2}>
              <Typography
                component="h2"
                sx={{ fontSize: "18px", fontWeight: 700 }}
              >
                {dayLabel}
                {dayTitle && !isDefaultTitle ? ` · ${dayTitle}` : ""}
              </Typography>
              {selectedDay.note && (
                <Typography
                  variant="body2"
                  sx={{ whiteSpace: "pre-wrap", color: "text.secondary" }}
                >
                  {selectedDay.note}
                </Typography>
              )}
              {selectedDay.activities.length ? (
                <Stack spacing={0}>
                  {selectedDay.activities.map((activity, index) => (
                    <Stack
                      data-template-activity={index}
                      key={`${selectedDay.id}:${index}`}
                      spacing={0.5}
                      useFlexGap
                      sx={{ minWidth: 0 }}
                    >
                      <ActivityTimelineCard
                        key={`${selectedDay.id}:${index}`}
                        activity={{
                          ...activity,
                          category: normalizeActivityCategory(
                            activity.category,
                          ),
                          status: "PLANNED",
                        }}
                        currency={currency}
                        order={index + 1}
                        hasNext={index < selectedDay.activities.length - 1}
                        selected={index === selectedActivityIndex}
                        onSelect={
                          onSelectActivity
                            ? () => onSelectActivity(index)
                            : undefined
                        }
                        readOnly
                      />
                      {onChoosePlace && activity.location?.trim() && (
                        <AppButton
                          intent="text"
                          size="small"
                          startIcon={<AddRoundedIcon />}
                          aria-label={t("addPlaceToTrip")}
                          sx={{ alignSelf: "flex-start" }}
                          onClick={() => onChoosePlace(activity)}
                        >
                          {t(compactActions ? "addPlaceShort" : "addPlaceToTrip")}
                        </AppButton>
                      )}
                    </Stack>
                  ))}
                </Stack>
              ) : (
                <AppEmptyState
                  title={t("restDay")}
                  icon={<EventAvailableRoundedIcon />}
                />
              )}
            </Stack>
          </AppCard>
        </>
      )}
      {!!snapshot.checklists.length && (
        <AppCard>
          <Stack spacing={1}>
            <Typography component="h2" sx={{ fontWeight: 700 }}>
              {t("checklist")}
            </Typography>
            <Stack component="ul" spacing={1} sx={{ m: 0, pl: 2.5 }}>
              {snapshot.checklists.map((item, index) => (
                <Typography component="li" key={index} variant="body2">
                  {item.title}
                </Typography>
              ))}
            </Stack>
          </Stack>
        </AppCard>
      )}
    </Stack>
  );
};

export default TemplateItinerary;
