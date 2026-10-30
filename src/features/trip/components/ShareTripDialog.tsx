'use client';

import React, { useState } from 'react';
import {
  Box,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import { useTranslations } from 'next-intl';

import { AppButton, AppDialog } from '@/base/components/ui';
import {
  useTripShareSettings,
  useUpdateShareSettings,
  useRegenerateShareToken,
} from '../hooks/useTripShare';
import type { TripVisibility } from '../types';
import { useTripPermissions } from '../hooks/useTripPermissions';
import { Share } from '@mui/icons-material';

export interface ShareTripDialogProps {
  open: boolean;
  onClose: () => void;
  tripId: string | number;
  tripName: string;
}

const ShareTripDialog = ({
  open,
  onClose,
  tripId,
  tripName,
}: ShareTripDialogProps) => {
  const theme = useTheme();
  const { canManage } = useTripPermissions(tripId, open);
  const t = useTranslations('trip.share');

  const { shareSettings, isLoading } = useTripShareSettings({
    tripId,
    enabled: open,
  });

  const [userVisibility, setUserVisibility] = useState<TripVisibility | null>(
    null,
  );
  const [copied, setCopied] = useState<boolean>(false);

  const visibility = userVisibility ?? shareSettings?.visibility ?? 'PRIVATE';
  const publicRole = 'MEMBER' as const;

  const handleClose = () => {
    setUserVisibility(null);
    setCopied(false);
    onClose();
  };

  const { updateShareSettings, isPending: isUpdating } = useUpdateShareSettings(
    {
      tripId,
      options: {
        onSuccess: () => {
          handleClose();
        },
      },
    },
  );

  const { regenerateShareToken, isPending: isRegenerating } =
    useRegenerateShareToken({
      tripId,
      options: {
        onSuccess: () => {
          setCopied(false);
        },
      },
    });

  const shareToken = shareSettings?.shareToken ?? '';
  const shareUrl =
    typeof window !== 'undefined' && shareToken
      ? `${window.location.origin}/share/trip/${shareToken}`
      : '';

  const handleCopyLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleSave = () => {
    if (!canManage) return;
    updateShareSettings({
      visibility,
      publicRole,
    });
  };

  const handleRegenerate = () => {
    if (!canManage) return;
    if (window.confirm(t('confirmRegenerate'))) {
      regenerateShareToken({});
    }
  };

  return (
    <AppDialog
      open={open}
      onClose={handleClose}
      title={t('dialogTitle')}
      description={t('dialogSubtitle', { name: tripName })}
      icon={<Share />}
      maxWidth="sm"
      actions={
        <Stack
          direction="row"
          spacing={1.5}
          useFlexGap
          sx={{
            justifyContent: 'flex-end',
            width: '100%',
            flexWrap: 'wrap',
            gap: 1.5,
          }}
        >
          <AppButton data-dialog-action="cancel" intent="secondary" onClick={handleClose}>
            {t('cancel')}
          </AppButton>
          <AppButton
            data-dialog-action="primary"
            intent="primary"
            onClick={handleSave}
            loading={isUpdating}
            disabled={!canManage}
          >
            {t('saveChanges')}
          </AppButton>
        </Stack>
      }
    >
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={32} />
        </Box>
      ) : (
        <Stack spacing={2.5}>
          <FormControl
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              width: '100%',
            }}
          >
            <FormLabel
              sx={{
                fontSize: '13px',
                fontWeight: 700,
                color: 'text.primary',
                '&.Mui-focused': { color: 'text.primary' },
              }}
            >
              {t('accessLevelLabel')}
            </FormLabel>
            <RadioGroup
              value={visibility}
              onChange={(e) =>
                setUserVisibility(e.target.value as TripVisibility)
              }
              sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}
            >
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: '14px',
                  border: '1px solid',
                  borderColor:
                    visibility === 'PRIVATE'
                      ? 'primary.main'
                      : alpha(theme.palette.divider, 0.8),
                  bgcolor:
                    visibility === 'PRIVATE'
                      ? alpha(theme.palette.primary.main, 0.04)
                      : 'background.paper',
                  boxShadow: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: 'none',
                  },
                }}
                onClick={() => canManage && setUserVisibility('PRIVATE')}
              >
                <FormControlLabel
                  value="PRIVATE"
                  disabled={!canManage}
                  control={<Radio size="small" />}
                  label={
                    <Box
                      sx={{
                        pl: 0.5,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.25,
                      }}
                    >
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <LockRoundedIcon
                          sx={{
                            fontSize: '18px',
                            color:
                              visibility === 'PRIVATE'
                                ? 'primary.main'
                                : 'text.secondary',
                          }}
                        />
                        <Typography sx={{ fontWeight: 700, fontSize: '14px' }}>
                          {t('privateTitle')}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          fontSize: '12px',
                        }}
                      >
                        {t('privateDesc')}
                      </Typography>
                    </Box>
                  }
                  sx={{ m: 0, width: '100%', alignItems: 'flex-start' }}
                />
              </Box>

              <Box
                sx={{
                  p: 1.5,
                  borderRadius: '14px',
                  border: '1px solid',
                  borderColor:
                    visibility === 'PUBLIC'
                      ? 'primary.main'
                      : alpha(theme.palette.divider, 0.8),
                  bgcolor:
                    visibility === 'PUBLIC'
                      ? alpha(theme.palette.primary.main, 0.04)
                      : 'background.paper',
                  boxShadow: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: 'none',
                  },
                }}
                onClick={() => canManage && setUserVisibility('PUBLIC')}
              >
                <FormControlLabel
                  value="PUBLIC"
                  disabled={!canManage}
                  control={<Radio size="small" />}
                  label={
                    <Box
                      sx={{
                        pl: 0.5,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.25,
                      }}
                    >
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <PublicRoundedIcon
                          sx={{
                            fontSize: '18px',
                            color:
                              visibility === 'PUBLIC'
                                ? 'primary.main'
                                : 'text.secondary',
                          }}
                        />
                        <Typography sx={{ fontWeight: 700, fontSize: '14px' }}>
                          {t('publicTitle')}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                          fontSize: '12px',
                        }}
                      >
                        {t('publicDesc')}
                      </Typography>
                    </Box>
                  }
                  sx={{ m: 0, width: '100%', alignItems: 'flex-start' }}
                />

                {visibility === 'PUBLIC' && (
                  <Box
                    sx={{
                      pt: 1.5,
                      borderTop: 1,
                      borderColor: alpha(theme.palette.divider, 0.6),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 1.5,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Box>
                      <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>
                        {t('publicRoleLabel')}
                      </Typography>
                      <Typography
                        sx={{ fontSize: '11px', color: 'text.secondary' }}
                      >
                        {t('memberDesc')}
                      </Typography>
                    </Box>

                    <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>
                      {t('roleMember')}
                    </Typography>
                  </Box>
                )}
              </Box>
            </RadioGroup>
          </FormControl>

          <Divider />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography
                sx={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: 'text.primary',
                }}
              >
                {t('shareLinkTitle')}
              </Typography>
              <Tooltip title={t('regenerateTooltip')} arrow placement="top">
                <Box
                  component="button"
                  type="button"
                  onClick={handleRegenerate}
                  disabled={isRegenerating || !canManage}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.6,
                    border: 'none',
                    bgcolor: 'transparent',
                    color: 'text.secondary',
                    cursor: isRegenerating ? 'not-allowed' : 'pointer',
                    fontSize: '11px',
                    fontWeight: 600,
                    py: 0.5,
                    px: 1,
                    borderRadius: '8px',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'action.hover',
                      color: 'primary.main',
                    },
                  }}
                >
                  <RefreshRoundedIcon
                    sx={{
                      fontSize: '15px',
                      animation: isRegenerating
                        ? 'spin 1s linear infinite'
                        : 'none',
                      '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' },
                      },
                    }}
                  />
                  <span>{t('regenerateBtn')}</span>
                </Box>
              </Tooltip>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.05)'
                    : '#F8FAFC',
                border: 1,
                borderColor: (theme) => alpha(theme.palette.divider, 0.8),
                borderRadius: '12px',
                boxShadow: 'none',
                p: 0.6,
                pl: 1.5,
                gap: 1.5,
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: 'none',
                },
              }}
            >
              <Box
                component="input"
                readOnly
                value={shareUrl}
                onClick={(e: React.MouseEvent<HTMLInputElement>) =>
                  e.currentTarget.select()
                }
                sx={{
                  flex: 1,
                  minWidth: 0,
                  border: 'none',
                  outline: 'none',
                  bgcolor: 'transparent',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12.5px',
                  color: 'text.primary',
                  cursor: 'text',
                  userSelect: 'all',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              />

              <AppButton
                size="small"
                intent={copied ? 'primary' : 'secondary'}
                startIcon={
                  copied ? (
                    <CheckRoundedIcon sx={{ fontSize: '15px' }} />
                  ) : (
                    <ContentCopyRoundedIcon sx={{ fontSize: '15px' }} />
                  )
                }
                onClick={handleCopyLink}
                sx={{
                  flexShrink: 0,
                  minHeight: '34px',
                  height: '34px',
                  px: 1.5,
                  fontSize: '12px',
                  fontWeight: 700,
                  borderRadius: '8px',
                }}
              >
                {copied ? t('copiedBtn') : t('copyBtn')}
              </AppButton>
            </Box>

            <Typography sx={{ fontSize: '11px', color: 'text.secondary' }}>
              {visibility === 'PUBLIC'
                ? t('publicLinkNotice')
                : t('privateLinkNotice')}
            </Typography>
          </Box>
        </Stack>
      )}
    </AppDialog>
  );
};

export default ShareTripDialog;
