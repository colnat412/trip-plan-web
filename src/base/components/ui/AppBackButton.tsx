'use client';
import Link from 'next/link';
import { Box, IconButton } from '@mui/material';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import { useTranslations } from 'next-intl';
export interface AppBackButtonProps {
  href?: string;
  onClick?: () => void;
  label?: string;
  disabled?: boolean;
}
export default function AppBackButton({ href, onClick, label, disabled = false }: AppBackButtonProps) {
  const t = useTranslations('dialog');
  const icon = <Box component="span" aria-hidden="true" sx={{
    width: 36, height: 36, boxSizing: 'border-box', borderRadius: '50%',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    bgcolor: 'background.paper', border: 1, borderColor: 'divider',
  }}><ChevronLeftRoundedIcon sx={{ fontSize: 20 }} /></Box>;
  const sx = {
    width: 44, height: 44, borderRadius: '50%', p: 0, bgcolor: 'transparent', color: 'text.primary',
    '&:hover': { bgcolor: 'transparent', '& > .MuiBox-root': { bgcolor: 'action.hover' } },
    '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 3 },
  };
  return href ? <IconButton component={Link} href={href} disabled={disabled} aria-label={label ?? t('back')} sx={sx}>{icon}</IconButton>
    : <IconButton onClick={onClick} disabled={disabled} aria-label={label ?? t('back')} sx={sx}>{icon}</IconButton>;
}
