"use client";

import { Box, Button, ButtonProps } from "@mui/material";

import AppLoadingIndicator from "./AppLoadingIndicator";

import type { AnchorHTMLAttributes } from "react";
import { alpha, type Theme } from "@mui/material/styles";
import { interactionTransition } from '@/base/theme/interactions';
import type { SxProps } from "@mui/system";

export type AppButtonIntent =
  "primary" | "secondary" | "success" | "danger" | "text";

export type AppButtonProps = Omit<ButtonProps, "color" | "variant"> &
  Pick<AnchorHTMLAttributes<HTMLAnchorElement>, "target" | "rel"> & {
    intent?: AppButtonIntent;
    loading?: boolean;
    round?: boolean;
    mobileIconLabel?: boolean;
    wrapLabel?: boolean;
    selected?: boolean;
  };

function getPrimaryBackground(theme: Theme) {
  const palette = theme.vars?.palette ?? theme.palette;
  const primaryGradient = `linear-gradient(135deg, ${palette.primary.main}, ${palette.primary.light})`;
  const shade = 'var(--app-primary-button-shade, transparent)';
  return `linear-gradient(${shade}, ${shade}), ${primaryGradient}`;
}

function getSelectedStyles(selected: boolean): SxProps<Theme> {
  if (!selected) return {};

  return (theme) => {
    const palette = theme.vars?.palette ?? theme.palette;

    return {
      color: palette.primary.contrastText,
      background: palette.primary.main,
      borderColor: palette.primary.main,

      "&:hover": {
        color: palette.primary.contrastText,
        background: palette.primary.main,
        borderColor: palette.primary.main,
        filter: "brightness(0.92)",
      },

      "&:active": {
        background: palette.primary.main,
        filter: "brightness(0.85)",
      },
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
    const primaryBackground = getPrimaryBackground(theme);
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

          '--app-primary-button-shade': alpha(theme.palette.common.black, 0.3),
          ...theme.applyStyles('dark', { '--app-primary-button-shade': 'transparent' }),
          color: palette.primary.contrastText,
          background: primaryBackground,

          "&:hover": {
            color: palette.primary.contrastText,
            background: primaryBackground,
            filter: "brightness(0.92)",
          },

          "&:active": {
            color: palette.primary.contrastText,
            background: primaryBackground,
            filter: "brightness(0.85)",
          },

          "&.Mui-disabled": {
            color: palette.action.disabled,
            background: palette.action.disabledBackground,
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
            backgroundColor: palette.action.hover,
            borderColor: palette.divider,
          },

          "&:active": {
            backgroundColor: `color-mix(in srgb, ${palette.primary.main} 12%, transparent)`,
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
            ? palette.primary.contrastText
            : palette.text.primary,
          "& > *:nth-of-type(1)": { fontSize: "28px" },
        },
        "&:hover, &:active": {
          background: "transparent",
          color: palette.text.primary,
          filter: "none",
        },
        "&:hover .MuiButton-startIcon": {
          background: isPrimary ? primaryBackground : palette.action.hover,
          filter: isPrimary ? "brightness(0.92)" : "none",
        },
        "&:active .MuiButton-startIcon": {
          background: isPrimary ? primaryBackground : palette.action.selected,
          filter: isPrimary ? "brightness(0.85)" : "none",
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
