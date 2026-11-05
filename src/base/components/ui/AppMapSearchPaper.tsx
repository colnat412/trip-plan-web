'use client';

import { Box, Paper, type PaperProps } from '@mui/material';
import { createContext, useContext } from 'react';
import type { MapsSource } from '@/base/types/maps';

export const AppMapSearchSourcesContext = createContext<
  ReadonlyArray<string | undefined>
>([]);

const AppMapSearchPaper = ({ children, ...props }: PaperProps) => {
  const resultSources = useContext(AppMapSearchSourcesContext);
  const sources = [
    ...new Set(
      resultSources.filter(
        (source): source is MapsSource =>
          source === 'osm' || source === 'vietmap',
      ),
    ),
  ];

  return <Paper {...props}>{children}</Paper>;
};

export default AppMapSearchPaper;
