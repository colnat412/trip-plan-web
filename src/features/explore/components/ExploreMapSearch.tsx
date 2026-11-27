"use client";
import Link from "next/link";
import {
  Autocomplete,
  Box,
  CircularProgress,
  InputAdornment,
  Stack,
  Typography,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import { useTranslations } from "next-intl";
import {
  AppButton,
  AppMapSearchPaper,
  AppTextField,
} from "@/base/components/ui";
import type { MapPlacePrediction } from "@/base/types/maps";
import type useExploreMapSearch from "../hooks/useExploreMapSearch";
interface ExploreMapSearchProps {
  model: ReturnType<typeof useExploreMapSearch>;
  onInput: (text: string) => void;
  onChoose: (prediction: MapPlacePrediction) => void;
}
export default function ExploreMapSearch({
  model,
  onInput,
  onChoose,
}: ExploreMapSearchProps) {
  const t = useTranslations("explore");
  return (
    <Stack spacing={0.5} useFlexGap sx={{ pointerEvents: "auto", minWidth: 0 }}>
      <Autocomplete<MapPlacePrediction, false, false, true>
        freeSolo
        size="small"
        slots={{ paper: AppMapSearchPaper }}
        value={model.chosen}
        inputValue={model.search}
        options={model.options}
        filterOptions={(options) => options}
        loading={model.loading}
        loadingText={t("loading")}
        noOptionsText={t("noMapResults")}
        getOptionLabel={(option) =>
          typeof option === "string"
            ? option
            : option.description || option.mainText
        }
        isOptionEqualToValue={(option, value) =>
          typeof value !== "string" && option.placeId === value.placeId
        }
        onInputChange={(_, value, reason) => {
          if (reason === "input" || reason === "clear") onInput(value);
        }}
        onChange={(_, value) => {
          if (typeof value === "string" && value.trim())
            onChoose({
              placeId: `query:${value.trim()}`,
              mainText: value.trim(),
              description: value.trim(),
              secondaryText: "",
              source: "vietmap",
            });
          else if (value && typeof value !== "string") onChoose(value);
          else onInput("");
        }}
        slotProps={{
          listbox: {
            sx: {
              maxHeight: "min(320px, 45dvh)",
              overscrollBehavior: "contain",
            },
          },
        }}
        renderOption={(props, option) => {
          const { key, ...rest } = props;
          return (
            <Box
              component="li"
              key={key}
              {...rest}
              sx={{ gap: 1, minHeight: 52 }}
            >
              <PlaceOutlinedIcon fontSize="small" color="primary" />
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="body2" noWrap>
                  {option.mainText}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflowWrap: "anywhere",
                  }}
                >
                  {option.secondaryText}
                </Typography>
              </Box>
            </Box>
          );
        }}
        renderInput={(params) => (
          <AppTextField
            id={params.id}
            disabled={params.disabled}
            size="small"
            placeholder={t("search")}
            fullWidth
            error={!!model.error}
            helperText={model.error ? t("mapSearchFailed") : undefined}
            sx={{
              minWidth: 0,
              borderRadius: "var(--app-radius-control)",
              boxShadow: 2,
            }}
            slotProps={{
              inputLabel: params.slotProps.inputLabel,
              htmlInput: {
                ...params.slotProps.htmlInput,
                maxLength: 250,
                "aria-label": t("search"),
              },
              input: {
                ...params.slotProps.input,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <>
                    {(model.loading || model.resolving) && (
                      <CircularProgress size={18} />
                    )}
                    {params.slotProps.input.endAdornment}
                  </>
                ),
              },
            }}
          />
        )}
      />
      {model.loginRequired && (
        <AppButton
          component={Link}
          href="/login?returnTo=%2Fexplore"
          intent="secondary"
          size="small"
          sx={{ bgcolor: "background.paper", alignSelf: "flex-start" }}
        >
          {t("mapSearchLogin")}
        </AppButton>
      )}
    </Stack>
  );
}
