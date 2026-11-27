"use client";
import type { ReactNode } from "react";
import { Box } from "@mui/material";
import { glassSurface } from "@/base/theme/surfaces";
interface AppBottomActionBarProps {
  children: ReactNode;
}
export default function AppBottomActionBar({
  children,
}: AppBottomActionBarProps) {
  return (
    <Box
      sx={(theme) => ({
        position: "fixed",
        insetInline: 0,
        bottom:
          "calc(var(--app-bottom-navigation-space, env(safe-area-inset-bottom, 0px)) + 12px)",
        px: "max(16px, env(safe-area-inset-left, 0px), env(safe-area-inset-right, 0px))",
        zIndex: theme.zIndex.appBar + 1,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
      })}
    >
      <Box
        sx={(theme) => ({
          ...glassSurface(theme, "navigation"),
          width: "100%",
          maxWidth: 1040,
          minWidth: 0,
          p: 1,
          display: "flex",
          gap: 1,
          alignItems: "center",
          borderRadius: "var(--app-radius-control)",
          pointerEvents: "auto",
        })}
      >
        {children}
      </Box>
    </Box>
  );
}
