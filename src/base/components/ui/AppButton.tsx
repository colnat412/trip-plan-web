"use client";

import { Button, ButtonProps } from "@mui/material";

import type { Theme } from "@mui/material/styles";
import type { SxProps } from "@mui/system";

export type AppButtonIntent =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "text";

export type AppButtonProps = Omit<ButtonProps, "color" | "variant"> & {
  intent?: AppButtonIntent;
  loading?: boolean;
  round?: boolean;
  selected?: boolean;
};

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
    const primaryGradient = `linear-gradient(135deg, ${palette.primary.main}, ${palette.primary.light})`;
    const commonStyles = {
      ...(round && { borderRadius: "999px" }),
      "&.Mui-focusVisible": {
        outline: `2px solid ${palette.primary.main}`,
        outlineOffset: "3px",
      },
    };

    switch (intent) {
      case "primary":
        return {
          ...commonStyles,

          color: palette.primary.contrastText,
          background: primaryGradient,

          "&:hover": {
            background: primaryGradient,
            filter: "brightness(0.92)",
          },

          "&:active": {
            background: primaryGradient,
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

const AppButton = ({
  children,
  intent = "primary",
  loading = false,
  round = false,
  selected,
  disabled = false,
  size = "large",
  startIcon,
  loadingPosition = "center",
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
      aria-busy={loading || undefined}
      aria-pressed={buttonProps['aria-pressed'] ?? selected}
      startIcon={startIcon}
      sx={[
        getButtonStyles(intent, round),
        getSelectedStyles(selected ?? false),
        ...(Array.isArray(sx) ? sx : [sx]),
        // Keep MUI's centered loader readable without exposing the retained label.
        ...(loading && loadingPosition === "center"
          ? [{
              '&.MuiButton-loading': { color: 'transparent' },
              '& .MuiButton-loadingIndicator': { color: 'text.primary' },
            }]
          : []),
      ]}
    >
      {children}
    </Button>
  );
};

export default AppButton;
