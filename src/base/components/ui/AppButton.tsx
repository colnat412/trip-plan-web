"use client";

import { Box, Button, ButtonProps } from "@mui/material";

import AppLoadingIndicator from "./AppLoadingIndicator";

import type { AnchorHTMLAttributes } from "react";
import type { Theme } from "@mui/material/styles";
import { brandSurface, selectedSurface } from '@/base/theme/surfaces';
import { interactionTransition } from '@/base/theme/interactions';
import type { SxProps } from "@mui/system";

export type AppButtonIntent =
  "primary" | "secondary" | "success" | "danger" | "text";



function getPrimaryBackground(theme: Theme, strength = 28) {
  return brandSurface(theme, strength).backgroundColor;
}

function getSelectedStyles(selected: boolean): SxProps<Theme> {
  if (!selected) return {};

  return (theme) => {
    const palette = theme.vars?.palette ?? theme.palette;

    return {
      ...selectedSurface(theme),
      "&.Mui-disabled": {
        color: palette.action.disabled,
        background: palette.action.disabledBackground,
        borderColor: palette.action.disabledBackground,
        filter: "none",
      },
    };
  };
}

function getButtonStyles(
  intent: AppButtonIntent,
  round: boolean,
): SxProps<Theme> {
  return (theme) => {
    const palette = theme.vars?.palette ?? theme.palette;
    const commonStyles = {
      ...interactionTransition(theme, ['background-color', 'border-color', 'box-shadow', 'color', 'filter']),
      flexShrink: 0,
      whiteSpace: "nowrap",
      maxWidth: "100%",
      ...(round && { borderRadius: "var(--app-radius-pill)" }),
      "&.Mui-focusVisible": {
        outline: `2px solid ${palette.primary.main}`,
        outlineOffset: "3px",
      },
    };

    switch (intent) {
      case "primary":
        return {
          ...commonStyles,

          ...brandSurface(theme),
          border: '1px solid',
          "&:hover": brandSurface(theme, 20),
          "&:active": brandSurface(theme, 12),

          "&.Mui-disabled": {
            color: palette.action.disabled,
            background: palette.action.disabledBackground,
            borderColor: palette.action.disabledBackground,
            filter: "none",
          },
        };

      case "secondary":
        return {
          ...commonStyles,

          color: palette.text.primary,
          backgroundColor: palette.background.paper,
          border: `1px solid ${palette.divider}`,

          "&:hover": {
            color: palette.text.primary,
            backgroundColor: `color-mix(in srgb, ${palette.primary.main} 6%, ${palette.background.paper})`,
            borderColor: palette.divider,
          },

          "&:active": {
            backgroundColor: `color-mix(in srgb, ${palette.primary.main} 12%, ${palette.background.paper})`,
          },

          "&.Mui-disabled": {
            color: palette.action.disabled,
            backgroundColor: palette.background.paper,
            borderColor: palette.action.disabled,
          },
        };

      case "success":
        return {
          ...commonStyles,

          color: palette.success.main,
          backgroundColor: palette.background.paper,
          border: `1px solid ${palette.success.main}`,

          "&:hover": {
            color: palette.success.dark,
            backgroundColor: `color-mix(in srgb, ${palette.success.main} 12%, transparent)`,
            borderColor: palette.success.dark,
          },

          "&:active": {
            backgroundColor: `color-mix(in srgb, ${palette.success.main} 18%, transparent)`,
          },

          "&.Mui-disabled": {
            color: palette.action.disabled,
            backgroundColor: palette.background.paper,
            borderColor: palette.action.disabled,
          },
        };

      case "danger":
        return {
          ...commonStyles,

          color: palette.error.main,
          backgroundColor: `color-mix(in srgb, ${palette.error.main} 10%, transparent)`,
          border: "1px solid transparent",

          "&:hover": {
            color: palette.error.dark,
            backgroundColor: `color-mix(in srgb, ${palette.error.main} 12%, transparent)`,
            borderColor: "transparent",
          },

          "&:active": {
            backgroundColor: `color-mix(in srgb, ${palette.error.main} 18%, transparent)`,
          },

          "&.Mui-disabled": {
            color: palette.action.disabled,
            backgroundColor: palette.background.paper,
            borderColor: palette.action.disabled,
          },
        };

      case "text":
        return {
          ...commonStyles,

          color: palette.primary.main,
          backgroundColor: "transparent",

          "&:hover": {
            color: palette.primary.main,
            backgroundColor: `color-mix(in srgb, ${palette.primary.main} 12%, transparent)`,
          },

          "&:active": {
            backgroundColor: `color-mix(in srgb, ${palette.primary.main} 18%, transparent)`,
          },

          "&.Mui-disabled": {
            color: palette.action.disabled,
          },
        };
    }
  };
}

function getMobileIconLabelStyles(intent: AppButtonIntent): SxProps<Theme> {
  return (theme) => {
    const palette = theme.vars?.palette ?? theme.palette;
    const isPrimary = intent === "primary";
    const primaryBackground = getPrimaryBackground(theme);

    return {
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        minWidth: 0,
        minHeight: 100,
        padding: 0,
        display: "inline-flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        gap: 1,
        border: 0,
        borderRadius: "var(--app-radius-control)",
        background: "transparent",
        color: palette.text.primary,
        fontSize: "12px",
        fontWeight: 600,
        lineHeight: 1.4,
        textAlign: "center",
        whiteSpace: "normal",
        "& .MuiButton-startIcon": {
          margin: 0,
          width: 56,
          height: 56,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          background: isPrimary ? primaryBackground : palette.action.selected,
          color: isPrimary
            ? brandSurface(theme).color
            : palette.text.primary,
          "& > *:nth-of-type(1)": { fontSize: "28px" },
        },
        "&:hover, &:active": {
          background: "transparent",
          color: palette.text.primary,
          filter: "none",
        },
        "&:hover .MuiButton-startIcon": {
          background: isPrimary ? getPrimaryBackground(theme, 20) : palette.action.hover,
          filter: "none",
        },
        "&:active .MuiButton-startIcon": {
          background: isPrimary ? getPrimaryBackground(theme, 12) : palette.action.selected,
          filter: "none",
        },
        "&.Mui-disabled": {
          background: "transparent",
          color: palette.action.disabled,
          "& .MuiButton-startIcon": {
            background: palette.action.disabledBackground,
            color: palette.action.disabled,
            filter: "none",
          },
        },
      },
    };
  };
}

export interface AppButtonProps extends Omit<ButtonProps, "color" | "variant">,
  Pick<AnchorHTMLAttributes<HTMLAnchorElement>, "target" | "rel"> {
    intent?: AppButtonIntent;
    loading?: boolean;
    round?: boolean;
    mobileIconLabel?: boolean;
    wrapLabel?: boolean;
    selected?: boolean;
    scroll?: boolean;
  }

const AppButton = ({
  children,
  intent = "primary",
  loading = false,
  round = false,
  mobileIconLabel = false,
  wrapLabel = false,
  selected,
  disabled = false,
  size = "large",
  startIcon,
  loadingPosition = "center",
  loadingIndicator,
  sx,
  ...buttonProps
}: AppButtonProps) => {
  return (
    <Button
      {...buttonProps}
      size={size}
      disabled={disabled || loading}
      loading={loading}
      loadingPosition={loadingPosition}
      loadingIndicator={loadingIndicator ?? <AppLoadingIndicator sx={{ color: "inherit" }} />}
      aria-busy={loading || undefined}
      aria-pressed={buttonProps["aria-pressed"] ?? selected}
      startIcon={startIcon}
      sx={[
        getButtonStyles(intent, round),
        getSelectedStyles(selected ?? false),
        ...(wrapLabel ? [{ whiteSpace: "normal", overflowWrap: "anywhere" }] : []),
        ...(mobileIconLabel ? [getMobileIconLabelStyles(intent)] : []),
        ...(Array.isArray(sx) ? sx : [sx]),
        // Keep MUI's centered loader readable without exposing the retained label.
        ...(loading && loadingPosition === "center"
          ? [
              {
                "&.MuiButton-loading": { color: "transparent" },
                "& .MuiButton-loadingIndicator": { color: "text.primary" },
              },
            ]
          : []),
      ]}
    >
      {mobileIconLabel ? (
        <Box component="span" sx={{ minWidth: 0, overflowWrap: "anywhere" }}>
          {children}
        </Box>
      ) : (
        children
      )}
    </Button>
  );
};

export default AppButton;
