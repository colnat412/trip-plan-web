'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Alert, Box, Stack, Typography } from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { AppButton, AppDialog } from '@/base/components/ui';
import AppBrand from '@/base/components/layout/AppBrand';
import { useMutationPost } from '@/base/hooks';
import type { ApiResponse } from '@/base/api';
import type { UserProfile } from '@/features/auth/types';
import { useUserContext } from '@/features/user/context/UserContext';
import useLogout from '@/features/auth/hooks/useLogout';
import PolicyDocument from './PolicyDocument';
import PolicyAcceptanceCard from './PolicyAcceptanceCard';
import { POLICY_IDS, POLICY_VERSION, type PolicyId } from '../constants';

interface AcceptancePayload {
  termsAccepted: boolean;
  contentAccepted: boolean;
  privacyAccepted: boolean;
  version: string;
  locale: string;
}

const PolicyAcceptanceDialog = () => {
  const t = useTranslations('legal');
  const locale = useLocale();
  const { user, updateUser } = useUserContext();
  const [checked, setChecked] = useState({
    terms: false,
    content: false,
    privacy: false,
  });
  const [document, setDocument] = useState<PolicyId | null>(null);
  const [error, setError] = useState(false);
  const acceptance = useMutationPost<
    ApiResponse<UserProfile>,
    AcceptancePayload
  >({
    mutationKey: ['user', 'policies', 'accept'],
    endPoint: '/users/me/policies/accept',
  });
  const logout = useLogout();
  const busy = acceptance.isPending || logout.isPending;
  const allChecked = POLICY_IDS.every((id) => checked[id]);
  const acceptedCount = POLICY_IDS.filter((id) => checked[id]).length;
  const versionMatches = user?.requiredPolicyVersion === POLICY_VERSION;

  const accept = async () => {
    if (!allChecked || busy || !versionMatches) return;
    setError(false);
    try {
      const response = await acceptance.mutateAsync({
        termsAccepted: checked.terms,
        contentAccepted: checked.content,
        privacyAccepted: checked.privacy,
        version: POLICY_VERSION,
        locale: locale === 'en' ? 'en' : 'vi',
      });
      if (!response.data?.policiesAcceptedAt || !response.data.policiesVersion)
        throw new Error('Invalid acceptance response');
      updateUser(response.data);
    } catch {
      setError(true);
    }
  };

  const signOut = async () => {
    setError(false);
    try {
      await logout.mutateAsync({});
      window.location.assign(new URL('/login', window.location.origin).href);
    } catch {
      setError(true);
    }
  };

  return (
    <>
      <Box
        component="main"
        sx={{
          minHeight: '100dvh',
          bgcolor: 'background.paper',
          color: 'text.primary',
          backgroundImage: (theme) =>
            `linear-gradient(${theme.vars?.palette.action.hover ?? theme.palette.action.hover}, ${theme.vars?.palette.action.hover ?? theme.palette.action.hover})`,
        }}
      >
        <Box
          component="header"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            p: { xs: '12px', sm: '16px' },
            bgcolor: 'background.paper',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <AppBrand />
        </Box>
      </Box>
      <AppDialog
        open
        closeDisabled={document === null || busy}
        hideCloseButton={document === null}
        onClose={() => setDocument(null)}
        title={document ? t(`documents.${document}.title`) : t('title')}
        description={document ? undefined : t('compactDescription')}
        icon={<FactCheckRoundedIcon />}
        maxWidth="sm"
        actions={
          document ? (
            <AppButton
              intent="secondary"
              startIcon={<ArrowBackRoundedIcon />}
              onClick={() => setDocument(null)}
            >
              {t('backToAcceptance')}
            </AppButton>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: '8px',
                width: '100%',
              }}
            >
              <AppButton
                loading={acceptance.isPending}
                disabled={!allChecked || busy || !versionMatches}
                onClick={() => void accept()}
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{
                  flex: 1,
                  minHeight: '48px',
                  fontSize: '14px',
                  '&.Mui-disabled': {
                    color: 'text.disabled',
                    background: 'none',
                    bgcolor: 'action.disabledBackground',
                  },
                }}
              >
                {t('continue')}
              </AppButton>
              <AppButton
                intent="text"
                loading={logout.isPending}
                disabled={busy}
                onClick={() => void signOut()}
                startIcon={<LogoutRoundedIcon />}
                sx={{
                  color: 'text.secondary',
                  fontSize: '12px',
                  px: '12px',
                  minHeight: '44px',
                }}
              >
                {t('decline')}
              </AppButton>
            </Box>
          )
        }
      >
        {document ? (
          <PolicyDocument policy={document} />
        ) : (
          <Stack spacing={1.5}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                {/* {t('version', { version: POLICY_VERSION })} */}
              </Typography>
              <Typography
                role="status"
                aria-live="polite"
                sx={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: allChecked ? 'success.main' : 'text.secondary',
                }}
              >
                {t('acceptedCount', {
                  count: acceptedCount,
                  total: POLICY_IDS.length,
                })}
              </Typography>
            </Box>
            {POLICY_IDS.map((id) => (
              <PolicyAcceptanceCard
                key={id}
                policy={id}
                checked={checked[id]}
                disabled={busy}
                onRead={() => setDocument(id)}
                onChange={(value) =>
                  setChecked((previous) => ({ ...previous, [id]: value }))
                }
              />
            ))}
            {!versionMatches && (
              <Alert severity="warning">{t('versionMismatch')}</Alert>
            )}
            {error && (
              <Alert severity="error" role="alert">
                {t('saveError')}
              </Alert>
            )}
            {/* <Typography
              sx={{
                fontSize: '12px',
                color: 'text.secondary',
                lineHeight: 1.6,
              }}
            >
              {t('compactRecordNotice')}
            </Typography> */}
          </Stack>
        )}
      </AppDialog>
    </>
  );
};

export default PolicyAcceptanceDialog;
