"use client";
import { useState } from "react";
import {
  Box,
  ButtonBase,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import HotelRoundedIcon from "@mui/icons-material/HotelRounded";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import AppsRoundedIcon from "@mui/icons-material/AppsRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import { useTranslations } from "next-intl";
import {
  AppButton,
  AppFilterChip,
  AppDialog,
  AppTextField,
} from "@/base/components/ui";
import { PLACE_CATEGORIES, type ExploreItinerary } from "../types";
import type useExplorePlaces from "../hooks/useExplorePlaces";
interface PublishedTripPickerProps {
  model: ReturnType<typeof useExplorePlaces>;
  layerVisible: boolean;
  onChoose: (trip: ExploreItinerary) => void;
  onToggleLayer: () => void;
  onClear: () => void;
  onOpenChange?: (open: boolean) => void;
}
export default function PublishedTripPicker({
  model,
  layerVisible,
  onChoose,
  onToggleLayer,
  onClear,
  onOpenChange,
}: PublishedTripPickerProps) {
  const t = useTranslations("explore");
  const [open, setOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const closeMenu = () => { setOpen(false); onOpenChange?.(false); };
  return (
    <>
      <Stack spacing={1} useFlexGap sx={{ minWidth: 0, pointerEvents: 'auto' }}>
        <AppButton intent="secondary" size="small" startIcon={<MapOutlinedIcon />}
          aria-haspopup="dialog" aria-expanded={open}
          onClick={() => { setOpen(true); onOpenChange?.(true); }}
          wrapLabel sx={{ width: '100%', minWidth: 0, minHeight: 44, px: 1, boxShadow: 2, fontSize: 12, lineHeight: 1.3,
            bgcolor: 'background.paper', color: 'text.primary',
            '&:hover, &:active': { bgcolor: 'background.paper', color: 'text.primary', borderColor: 'primary.main' } }}>
          {t('communityTrips')}
        </AppButton>
        {model.selected && <Tooltip title={model.selected.title}>
          <AppButton intent="secondary" size="small" startIcon={<RouteRoundedIcon />}
            onClick={() => onChoose(model.selected!)}
            aria-label={`${t('showPlan')} · ${model.selected.title}`}
            sx={{ width: '100%', minWidth: 0, px: 1, boxShadow: 2 }}>
            <Typography component="span" noWrap sx={{ minWidth: 0, fontSize: 'inherit' }}>{model.selected.title}</Typography>
          </AppButton>
        </Tooltip>}
      </Stack>
      <AppDialog
        open={open}
        onClose={closeMenu}
        title={t('communityTrips')}
        titleAlign="left"
        icon={<MapOutlinedIcon />}
        showSheetHandle
        maxWidth="sm"
        paperSx={{ bgcolor: 'background.paper', backgroundImage: 'none',
          '@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))': {
            bgcolor: 'background.paper', backdropFilter: 'none', WebkitBackdropFilter: 'none',
          } }}
        actions={<Stack direction="row" spacing={0.5} useFlexGap sx={{ alignItems: 'center', flexWrap: 'wrap', minWidth: 0 }}>
          {model.selected && <AppButton intent="text" size="small" onClick={() => { onChoose(model.selected!); closeMenu(); }}>{t('showPlan')}</AppButton>}
          <AppButton intent="text" size="small"
            startIcon={layerVisible ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
            onClick={() => { onToggleLayer(); closeMenu(); }}
            wrapLabel sx={{ justifyContent: 'flex-start', textAlign: 'left' }}>
            {t(layerVisible ? 'hidePublished' : 'showPublished')}
          </AppButton>
          {model.selected && <AppButton intent="text" size="small" onClick={() => { onClear(); closeMenu(); }}>{t('clearPublished')}</AppButton>}
        </Stack>}

      >
        <Stack spacing={1} useFlexGap sx={{ minWidth: 0 }}>
          <Stack direction="row" spacing={1} useFlexGap sx={{ alignItems: 'center', minWidth: 0 }}>
            <AppTextField placeholder={t('searchPublished')} size="small" value={model.search}
              onChange={event => model.changeSearch(event.target.value)}
              slotProps={{
                htmlInput: { maxLength: 200, 'aria-label': t('searchPublished') },
                input: { startAdornment: <InputAdornment position="start"><SearchRoundedIcon fontSize="small" /></InputAdornment> },
              }} sx={{ flex: 1, minWidth: 0 }} />
            <Tooltip title={t('filters')}>
              <IconButton aria-label={t('filters')} aria-expanded={filtersOpen}
                onClick={() => setFiltersOpen(value => !value)} sx={{ width: 44, height: 44, flexShrink: 0 }}>
                <TuneRoundedIcon />
              </IconButton>
            </Tooltip>
          </Stack>
          {filtersOpen && (
          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            sx={{ overflowX: "auto", py: 0.5 }}
          >
            <AppFilterChip
              label={t("all")}
              icon={<AppsRoundedIcon />}
              selected={!model.category}
              onClick={() => model.changeCategory("")}
            />
            {PLACE_CATEGORIES.map((category) => (
              <AppFilterChip
                key={category}
                label={t(`categories.${category}`)}
                icon={
                  category === "FOOD" ? (
                    <RestaurantRoundedIcon />
                  ) : category === "STAY" ? (
                    <HotelRoundedIcon />
                  ) : category === "SIGHT" ? (
                    <ExploreOutlinedIcon />
                  ) : (
                    <PlaceOutlinedIcon />
                  )
                }
                selected={model.category === category}
                onClick={() => model.changeCategory(category)}
              />
            ))}
          </Stack>
          )}
          {model.loading && <CircularProgress size={24} />}
          {model.query.error && (
            <AppButton
              intent="secondary"
              onClick={() => void model.query.refetch()}
            >
              {t("retry")}
            </AppButton>
          )}
          {!model.loading && !model.query.error && !model.items.length && (
            <Typography variant="body2">{t("empty")}</Typography>
          )}
          {model.items.map((trip) => (
            <ButtonBase
              key={trip.id}
              onClick={() => {
                onChoose(trip);
                closeMenu();
              }}
              aria-pressed={model.selected?.id === trip.id}
              sx={{
                width: "100%",
                p: 1,
                gap: 1.5,
                textAlign: "left",
                justifyContent: "flex-start",
                flexShrink: 0,
                minWidth: 0,
                color: "text.primary",
                bgcolor: model.selected?.id === trip.id ? "action.selected" : "background.paper",
                '&:hover': { bgcolor: 'action.hover' },
                '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 },
                border: 1,
                borderColor:
                  model.selected?.id === trip.id ? "primary.main" : "divider",
                borderRadius: "var(--app-radius-control)",
              }}
            >
              {trip.coverUrl && (
                <Box
                  component="img"
                  src={trip.coverUrl}
                  alt=""
                  sx={{
                    width: 56,
                    height: 56,
                    objectFit: "cover",
                    flexShrink: 0,
                    borderRadius: "var(--app-radius-small)",
                  }}
                />
              )}
              <Stack spacing={0.5} useFlexGap sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflowWrap: "anywhere",
                  }}
                >
                  {trip.title}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {trip.destination}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t("duration", {
                    days: trip.durationDays,
                    nights: Math.max(0, trip.durationDays - 1),
                  })}
                  {Number.isFinite(trip.likeCount) && (
                    <Box
                      component="span"
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.5,
                        pl: 1,
                      }}
                    >
                      <FavoriteBorderRoundedIcon sx={{ fontSize: 14 }} />
                      {trip.likeCount}
                    </Box>
                  )}
                </Typography>
              </Stack>
            </ButtonBase>
          ))}
          {model.query.hasNextPage && (
            <AppButton
              intent="secondary"
              disabled={model.query.isFetchingNextPage}
              onClick={() => void model.query.fetchNextPage()}
            >
              {t("loadMore")}
            </AppButton>
          )}
        </Stack>
      </AppDialog>
    </>
  );
}
