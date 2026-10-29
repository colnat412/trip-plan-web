"use client";

import { ReactNode } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import AppToastProvider from "./AppToastProvider";
import appTheme from "../theme/theme";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";

type AppThemeProviderProps = {
  children: ReactNode;
};

const AppThemeProvider = ({ children }: AppThemeProviderProps) => {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeProvider theme={appTheme} defaultMode="light">
        <CssBaseline />
        <AppToastProvider>{children}</AppToastProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
};

export default AppThemeProvider;
