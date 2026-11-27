"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Stack, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import {
  AppPageContainer,
  AppBackHeader,
  AppButton,
} from "@/base/components/ui";
import AppBottomActionBar from "@/base/components/ui/AppBottomActionBar";
import AppErrorState from "@/base/components/ui/AppErrorState";
import { formatCurrency } from "@/base/utils";
import { normalizeActivityCategory } from "@/base/constants";
import AddTemplatePlaceDialog, {
  type TemplatePlaceSeed,
} from "./AddTemplatePlaceDialog";
import type { TemplateDetailData } from "../types";
import TemplateBanner from "./TemplateBanner";
import TemplateItinerary from "./TemplateItinerary";
import CopyTemplateDialog from "./CopyTemplateDialog";
import {
  TemplateSaveProvider,
  TemplateSaveButton,
} from "./TemplateSaveControls";
interface TemplateDetailProps {
  detail: TemplateDetailData | null;
  status: number;
  backHref?: "/explore" | "/templates";
}
export default function TemplateDetail({
  detail,
  status,
  backHref = "/templates",
}: TemplateDetailProps) {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("planTemplate");
  const [copyOpen, setCopyOpen] = useState(false);
  const [placeToAdd, setPlaceToAdd] = useState<TemplatePlaceSeed | null>(null);
  const backLabel = t(
    backHref === "/explore" ? "backToExplore" : "backToLibrary",
  );
  return (
    <AppPageContainer
      floatingAction={
        detail ? (
          <AppBottomActionBar>
            <AppButton
              intent="primary"
              size="medium"
              wrapLabel
              onClick={() => setCopyOpen(true)}
              sx={{ flex: 1, minWidth: 0 }}
            >
              {t("use")}
            </AppButton>
          </AppBottomActionBar>
        ) : undefined
      }
    >
      <Stack
        spacing={2.5}
        useFlexGap
        sx={{
          width: "100%",
          maxWidth: 1040,
          alignSelf: "center",
          minWidth: 0,
          overflowWrap: "anywhere",
        }}
      >
        {!detail ? (
          <>
            <AppBackHeader
              title={t("itinerary")}
              backHref={backHref}
              backLabel={backLabel}
              titleAlign="left"
            />
            <AppErrorState
              variant={
                status === 404
                  ? "notFound"
                  : status === 403
                    ? "forbidden"
                    : "load"
              }
              onRetry={() => router.refresh()}
            />
          </>
        ) : (
          <TemplateSaveProvider
            key={detail.template.id}
            ids={[detail.template.id]}
          >
            <AppBackHeader
              title={t("itinerary")}
              headingComponent="h2"
              backHref={backHref}
              backLabel={backLabel}
              titleAlign="left"
              actions={
                <TemplateSaveButton
                  id={detail.template.id}
                  likeCount={detail.template.likeCount}
                  iconOnly
                  showCount
                />
              }
            />
            <TemplateBanner
              src={detail.template.coverUrl}
              title={detail.template.title}
            />
            <Stack spacing={1} useFlexGap sx={{ minWidth: 0 }}>
              <Typography
                component="h1"
                sx={{
                  fontSize: { xs: 24, sm: 30 },
                  fontWeight: 800,
                  lineHeight: 1.3,
                }}
              >
                {detail.template.title}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {detail.template.destination}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("durationNightsLabel", {
                  days: detail.template.durationDays,
                  nights: Math.max(0, detail.template.durationDays - 1),
                })}{" "}
                ·{" "}
                {t("activityLabel", {
                  count: detail.snapshot.days.reduce(
                    (total, day) => total + day.activities.length,
                    0,
                  ),
                })}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t("author", {
                  name: detail.template.authorName,
                  count: detail.template.usageCount,
                })}
              </Typography>
              {detail.template.description?.trim() && (
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                  {detail.template.description}
                </Typography>
              )}
              <Stack
                direction="row"
                sx={{ flexWrap: "wrap", alignItems: "baseline", gap: 1 }}
              >
                <Typography variant="body2" color="text.secondary">
                  {t("cost")}:
                </Typography>
                <Typography
                  sx={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "primary.main",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {formatCurrency(
                    detail.template.estimatedCost,
                    detail.template.currency,
                    locale,
                  )}
                </Typography>
              </Stack>
            </Stack>
            <TemplateItinerary
              snapshot={detail.snapshot}
              currency={detail.template.currency}
              templateId={detail.template.id}
              templateVersion={detail.template.contentVersion}
              onRefreshTemplate={() => router.refresh()}
              onChoosePlace={(activity) =>
                setPlaceToAdd({
                  title: activity.title,
                  location: activity.location ?? undefined,
                  category: normalizeActivityCategory(activity.category),
                })
              }
            />
            <CopyTemplateDialog
              key={`${detail.template.id}:${detail.template.contentVersion}`}
              template={detail.template}
              open={copyOpen}
              onClose={() => setCopyOpen(false)}
            />
            {placeToAdd && (
              <AddTemplatePlaceDialog
                place={placeToAdd}
                templateId={detail.template.id}
                onClose={() => setPlaceToAdd(null)}
              />
            )}
          </TemplateSaveProvider>
        )}
      </Stack>
    </AppPageContainer>
  );
}
