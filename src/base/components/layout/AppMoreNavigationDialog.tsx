'use client';

import { Stack } from '@mui/material';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { AppDialog } from '@/base/components/ui';
import { isNavigationActive } from '@/base/utils';
import AppNavigationLink from './AppNavigationLink';
import { MORE_NAVIGATION_ITEMS } from './navigation/config';

interface AppMoreNavigationDialogProps {
  open: boolean;
  onClose: () => void;
}

const AppMoreNavigationDialog = ({
  open,
  onClose,
}: AppMoreNavigationDialogProps) => {
  const pathname = usePathname();
  const t = useTranslations('navigation');
  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title={t('more')}
      description={t('moreDescription')}
      icon={<MoreHorizRoundedIcon />}
      maxWidth="xs"
    >
      <Stack spacing={1}>
        {MORE_NAVIGATION_ITEMS.map((item) => (
          <AppNavigationLink
            key={item.id}
            item={item}
            expanded
            active={isNavigationActive(pathname, item.href)}
            onNavigate={onClose}
          />
        ))}
      </Stack>
    </AppDialog>
  );
};
export default AppMoreNavigationDialog;
