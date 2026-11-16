'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { Box } from '@mui/material';
import { financeStyles } from '@/base/theme/finance';

const FinanceStyleContext = createContext(false);
export const useFinanceStyle = () => useContext(FinanceStyleContext);

export default function FinanceStyleProvider({ children, surface = true }: { children: ReactNode; surface?: boolean }) {
  return (
    <FinanceStyleContext.Provider value={true}>
      {surface ? (
        <Box data-finance-surface sx={(theme) => ({ ...financeStyles(theme), minHeight: '100%', width: '100%', minWidth: 0 })}>
          {children}
        </Box>
      ) : children}
    </FinanceStyleContext.Provider>
  );
}
