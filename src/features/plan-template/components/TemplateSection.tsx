import type { ReactNode } from 'react';
import { Box } from '@mui/material';
import { AppPageContainer } from '@/base/components/ui';
import TemplateNavigation from './TemplateNavigation';

export default function TemplateSection({
  active,
  children,
}: {
  active: 'explore' | 'saved' | 'mine';
  children: ReactNode;
}) {
  return (
    <AppPageContainer>
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 2,
          flexShrink: 0,
          bgcolor: 'background.paper',
          borderRadius: '12px',
          pb: 1,
        }}
      >
        <TemplateNavigation active={active} />
      </Box>
      {children}
    </AppPageContainer>
  );
}
