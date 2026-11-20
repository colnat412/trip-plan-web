'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { type FormEvent, useRef, useState } from 'react';
import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
} from '@mui/material';
import {
  EmailOutlined,
  LockOutlined,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from '@mui/icons-material';

import { getAuthReturnPath } from '@/base/utils/auth-return-path';
import { AppButton, AppTextField, AppToast } from '@/base/components/ui';
import useLogin from '@/features/auth/hooks/useLogin';

import GoogleAuthButton from './GoogleAuthButton';
import LoginBrandPanel from './LoginBrandPanel';
import { useTranslations } from 'next-intl';

interface LoginFormErrors {
  email?: string;
  password?: string;
}

const Login = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [formErrors, setFormErrors] = useState<LoginFormErrors>({});
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const { loginMutation } = useLogin();
  const [emailPending, setEmailPending] = useState(false);
  const [googlePending, setGooglePending] = useState(false);
  const submitting = useRef(false);
  const busy = emailPending || googlePending || loginMutation.isPending;
  const t = useTranslations();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy || submitting.current) return;

    const normalizedEmail = email.trim().toLowerCase();
    const nextErrors: LoginFormErrors = {};

    if (!normalizedEmail) {
      nextErrors.email = t('validation.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      nextErrors.email = t('validation.emailInvalid');
    }

    if (!password) {
      nextErrors.password = t('validation.passwordRequired');
    }

    setFormErrors(nextErrors);

    if (nextErrors.email) {
      emailInputRef.current?.focus();
      return;
    }

    if (nextErrors.password) {
      passwordInputRef.current?.focus();
      return;
    }

    submitting.current = true;
    setEmailPending(true);
    loginMutation.mutate(
      {
        email: normalizedEmail,
        password,
        rememberMe,
      },
      {
        onSuccess: () => {
          const returnTo = new URLSearchParams(window.location.search).get(
            'returnTo',
          );
          router.push(
            getAuthReturnPath(returnTo),
          );
          router.refresh();
        },
        onError: () => {
          submitting.current = false;
          setEmailPending(false);
          passwordInputRef.current?.focus();
        },
      },
    );
  };

  return (
    <Box
      component="section"
      sx={{
        minHeight: '100svh',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        bgcolor: { xs: 'primary.dark', md: 'background.paper' },
      }}
    >
      <AppToast
        open={Boolean(loginMutation.error)}
        severity="error"
        message={loginMutation.error?.message ?? ''}
        onClose={loginMutation.clearError}
      />

      <LoginBrandPanel />

      <Box
        sx={{
          display: 'flex',
          flexGrow: 0.85,
          flexShrink: 1,
          flexBasis: 0,
          minWidth: { xs: 0, md: '440px' },
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'center',
          p: { xs: '24px 24px max(32px, env(safe-area-inset-bottom))', sm: 5 },
          borderRadius: { xs: 'var(--app-radius-dialog) var(--app-radius-dialog) 0 0', md: 0 },
          bgcolor: 'background.paper',
          minHeight: { xs: 'calc(100svh - 240px)', sm: 'calc(100svh - 280px)', md: '100svh' },
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 480,
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <Typography
            component="h1"
            sx={{
              color: 'text.primary',
              fontFamily: 'var(--font-display)',
              fontSize: { xs: '26px', sm: '32px' },
              fontWeight: 700,
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            {t('login.title')}
          </Typography>
          <Typography color="text.secondary" sx={{ textAlign: { xs: 'center', md: 'left' }, fontSize: '14px' }}>
            {t('login.description')}
          </Typography>

          <Stack
            component="form"
            spacing={2}
            noValidate
            aria-busy={busy}
            onSubmit={handleSubmit}
          >
            <AppTextField
              label={t('login.email')}
              name="email"
              type="email"
              placeholder="user@example.com"
              autoComplete="email"
              required
              value={email}
              error={Boolean(formErrors.email)}
              helperText={formErrors.email}
              inputRef={emailInputRef}
              disabled={busy}
              onChange={(event) => {
                setEmail(event.target.value);
                setFormErrors((current) => ({
                  ...current,
                  email: undefined,
                }));
                loginMutation.clearError();
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <AppTextField
              label={t('login.password')}
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder={t('login.passwordPlaceholder')}
              autoComplete="current-password"
              required
              value={password}
              error={Boolean(formErrors.password)}
              helperText={formErrors.password}
              inputRef={passwordInputRef}
              disabled={busy}
              onChange={(event) => {
                setPassword(event.target.value);
                setFormErrors((current) => ({
                  ...current,
                  password: undefined,
                }));
                loginMutation.clearError();
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        type="button"
                        disabled={busy}
                        aria-label={
                          showPassword
                            ? t('login.hidePassword')
                            : t('login.showPassword')
                        }
                        edge="end"
                        onClick={() => setShowPassword((current) => !current)}
                      >
                        {showPassword ? (
                          <VisibilityOffOutlined />
                        ) : (
                          <VisibilityOutlined />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Stack
              sx={{ alignItems: 'center', justifyContent: 'space-between' }}
              direction={'row'}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={rememberMe}
                    disabled={busy}
                    onChange={(event) => setRememberMe(event.target.checked)}
                  />
                }
                label={t('login.rememberMe')}
                sx={{
                  '& .MuiFormControlLabel-label': { fontSize: '14px' },
                }}
              />
              {/* <Typography
                component={Link}
                href="#"
                sx={{
                  color: 'primary.main',
                  fontSize: '14px',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}
              >
                {t('login.forgotPassword')}
              </Typography> */}
            </Stack>

            <AppButton
              type="submit"
              fullWidth
              loading={loginMutation.isPending}
              disabled={busy}
              sx={{ minHeight: '54px', height: '54px' }}
            >
              {t('login.submit')}
            </AppButton>
          </Stack>

          <Divider>
            <Typography variant="caption" color="text.secondary">
              {t('login.orContinueWithEmail')}
            </Typography>
          </Divider>

          <GoogleAuthButton text="signin_with" disabled={busy} onPendingChange={setGooglePending} />

          <Stack
            spacing={'4px'}
            direction={'row'}
            sx={{ justifyContent: 'center' }}
          >
            <Typography align="center" color="text.secondary">
              {t('login.noAccount')}
            </Typography>
            <Box
              component={Link}
              href="/register"
              aria-disabled={busy || undefined}
              tabIndex={busy ? -1 : undefined}
              onClick={(event: React.MouseEvent<HTMLAnchorElement>) => { if (busy) event.preventDefault(); }}
              sx={{
                color: busy ? 'text.disabled' : 'primary.main',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              {t('login.createAccount')}
            </Box>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
