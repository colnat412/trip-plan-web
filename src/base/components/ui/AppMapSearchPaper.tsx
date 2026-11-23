'use client';

import { Paper, type PaperProps } from '@mui/material';
import { createContext } from 'react';

export const AppMapSearchSourcesContext = createContext<
  ReadonlyArray<string | undefined>
>([]);

const AppMapSearchPaper = ({ children, ...props }: PaperProps) => {
  return <Paper {...props}>{children}</Paper>;
};

export default AppMapSearchPaper;
