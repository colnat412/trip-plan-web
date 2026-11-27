"use client";
import { useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import {
  AppInteractiveMap,
  AppButton,
  AppSectionHeader,
  AppLoadingIndicator,
} from "@/base/components/ui";
import useTemplateMap from "../hooks/useTemplateMap";
interface TemplateMapProps {
  templateId: string;
  dayNumber: number;
  contentVersion?: number;
  onRefreshTemplate?: () => void;
}
const DEFAULT_CENTER = { latitude: 16, longitude: 106 };
export default function TemplateMap({
  templateId,
  dayNumber,
  contentVersion,
  onRefreshTemplate,
}: TemplateMapProps) {
  const t = useTranslations("planTemplate");
  const query = useTemplateMap(templateId, dayNumber, contentVersion);
  const [selected, setSelected] = useState("");
  return (
    <Stack spacing={1} useFlexGap>
      <AppSectionHeader
        title={t("mapTitle")}
        actions={query.isFetching ? <AppLoadingIndicator /> : undefined}
      />
      <Box
        sx={{
          height: { xs: 260, sm: 340 },
          width: "100%",
          minWidth: 0,
          overflow: "hidden",
          bgcolor: "action.hover",
          borderRadius: "var(--app-radius-card)",
        }}
      >
        <AppInteractiveMap
          coordinates={query.stops[0]?.coordinates ?? DEFAULT_CENTER}
          title={t("mapTitle")}
          stops={query.stops}
          selectedId={selected}
          onSelectStop={setSelected}
        />
      </Box>
      {query.stops.length > 1 && (
        <Typography variant="caption" color="text.secondary">
          {t("mapStraightLines")}
        </Typography>
      )}
      {query.error && (
        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          sx={{ alignItems: "center" }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>
            {t(query.error?.status === 409 ? "versionChanged" : "mapLoadError")}
          </Typography>
          <AppButton
            intent="text"
            size="small"
            disabled={query.isFetching}
            onClick={() => {
              if (query.error?.status === 409 && onRefreshTemplate)
                onRefreshTemplate();
              else void query.refetch();
            }}
          >
            {t("retry")}
          </AppButton>
        </Stack>
      )}
      {query.hasNextPage && (
        <AppButton
          intent="secondary"
          size="small"
          disabled={query.isFetching}
          loading={query.isFetchingNextPage}
          onClick={() => void query.fetchNextPage()}
        >
          {t("mapLoadMore")}
        </AppButton>
      )}
    </Stack>
  );
}
