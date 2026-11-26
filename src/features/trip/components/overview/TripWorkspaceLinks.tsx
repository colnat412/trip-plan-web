'use client';

import Link from 'next/link';
import { ButtonBase, Divider, Stack, Typography } from '@mui/material';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import NotesRoundedIcon from '@mui/icons-material/NotesRounded';
import { useTranslations } from 'next-intl';

export default function TripWorkspaceLinks({ tripId }: { tripId: string | number }) {
  const t = useTranslations('tripWorkspace');
  const destinations = [
    { label: 'plan', href: '/plan', icon: <CalendarMonthOutlinedIcon /> },
    { label: 'expenses', href: '/expenses', icon: <AccountBalanceWalletOutlinedIcon /> },
    { label: 'settlement', href: '/settlement', icon: <PaymentsOutlinedIcon /> },
    { label: 'notes', href: '/notes', icon: <NotesRoundedIcon /> },
  ] as const;
  return <Stack component="nav" aria-label={t('navigation')} direction="row" divider={<Divider orientation="vertical" flexItem />} sx={{ minWidth: 0 }}>
    {destinations.map(item => <ButtonBase key={item.href} component={Link} href={`${item.href}?tripId=${encodeURIComponent(String(tripId))}`} disableRipple sx={{
      flex: 1, minWidth: 0, minHeight: 64, py: 1, px: 1, gap: 0.75,
      display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, color: 'primary.main',
      borderRadius: 'var(--app-radius-small)',
      '& .MuiSvgIcon-root': { fontSize: 22, flexShrink: 0 },
      '@media (hover: hover) and (pointer: fine)': { '&:hover': { bgcolor: 'action.hover' } },
      '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: -2 },
    }}>
      {item.icon}
      <Typography component="span" sx={{ fontSize: 14, fontWeight: 600, textAlign: 'center' }}>{t(item.label)}</Typography>
    </ButtonBase>)}
  </Stack>;
}
