'use client';

import { useRouter } from 'next/navigation';
import { type FormEvent, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
} from '@mui/material';
import {
  EmailOutlined,
  LockOutlined,
  PersonOutlineOutlined,
  VisibilityOffOutlined,
  VisibilityOutlined,
  MarkEmailReadOutlined,
} from '@mui/icons-material';

import { DEFAULT_AUTH_REDIRECT_PATH } from '@/base/constants';
import { AppBackHeader, AppButton, AppCard, AppConfirmDialog, AppTextField, AppToast } from '@/base/components/ui';
import AppPreferencesMenu from '@/base/components/preferences/AppPreferencesMenu';
import AppBrand from '@/base/components/layout/AppBrand';
import LoginBrandPanel from './LoginBrandPanel';
import useRegister from '@/features/auth/hooks/useRegister';
import useVerifyOtp from '@/features/auth/hooks/useVerifyOtp';
import useResendOtp from '@/features/auth/hooks/useResendOtp';
import GoogleAuthButton from './GoogleAuthButton';
import { useTranslations } from 'next-intl';

interface RegisterFormErrors {
  name?: string;
  email?: string;
  password?: string;
  otp?: string;
}

const Register = () => {
  const router = useRouter();
  const t = useTranslations();

  const [step, setStep] = useState<'REGISTER' | 'OTP'>('REGISTER');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [formErrors, setFormErrors] = useState<RegisterFormErrors>({});
  const [countdown, setCountdown] = useState(0);
  const [resendAvailableAt, setResendAvailableAt] = useState(0);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const otpInputRef = useRef<HTMLInputElement>(null);

  const { registerMutation } = useRegister();
  const { verifyOtpMutation } = useVerifyOtp();
  const { resendOtpMutation } = useResendOtp();

  const busy = registerMutation.isPending || verifyOtpMutation.isPending || resendOtpMutation.isPending;

  useEffect(() => {
    if (step !== 'OTP') return;
    const updateCountdown = () => {
      const remaining = Math.max(0, Math.ceil((resendAvailableAt - Date.now()) / 1000));
      setCountdown(remaining);
      if (remaining === 0) clearInterval(timer);
    };
    const timer = setInterval(updateCountdown, 1000);
    const onVisible = () => { if (!document.hidden) updateCountdown(); };
    window.addEventListener('focus', updateCountdown);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(timer);
      window.removeEventListener('focus', updateCountdown);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [step, resendAvailableAt]);

  const handleRegisterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const nextErrors: RegisterFormErrors = {};

    if (!normalizedName) {
      nextErrors.name = t('validation.nameRequired');
    }

    if (!normalizedEmail) {
      nextErrors.email = t('validation.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      nextErrors.email = t('validation.emailInvalid');
    }

    if (!password) {
      nextErrors.password = t('validation.passwordRequired');
    } else if (password.length < 8) {
      nextErrors.password = t('validation.passwordMin');
    }

    setFormErrors(nextErrors);

    if (nextErrors.name) {
      nameInputRef.current?.focus();
      return;
    }
    if (nextErrors.email) {
      emailInputRef.current?.focus();
      return;
    }
    if (nextErrors.password) {
      passwordInputRef.current?.focus();
      return;
    }

    registerMutation.mutate(
      {
        name: normalizedName,
        email: normalizedEmail,
        password,
      },
      {
        onSuccess: () => {
          setEmail(normalizedEmail);
          setOtp('');
          setFormErrors({});
          setStep('OTP');
          setCountdown(60);
          setResendAvailableAt(Date.now() + 60_000);
          setSuccessToast(t('register.otpSentToast'));
        },
      },
    );
  };

  const handleVerifyOtpSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;

    const cleanOtp = otp.trim();
    if (!/^\d{6}$/.test(cleanOtp)) {
      setFormErrors({ otp: t('validation.otpRequired') });
      otpInputRef.current?.focus();
      return;
    }

    verifyOtpMutation.mutate(
      {
        email: email.trim().toLowerCase(),
        otp: cleanOtp,
      },
      {
        onSuccess: () => {
          router.push(DEFAULT_AUTH_REDIRECT_PATH);
          router.refresh();
        },
      },
    );
  };

  const handleResendOtp = () => {
    if (Date.now() < resendAvailableAt || busy) return;

    resendOtpMutation.mutate(
      {
        email: email.trim().toLowerCase(),
      },
      {
        onSuccess: () => {
          setCountdown(60);
          setResendAvailableAt(Date.now() + 60_000);
          setOtp('');
          setFormErrors({});
          verifyOtpMutation.clearError();
          otpInputRef.current?.focus();
          setSuccessToast(t('register.otpResentToast'));
        },
      },
    );
  };

  const emailAlreadyRegistered = registerMutation.error?.status === 409;
  const activeErrorMessage = registerMutation.error?.status === 503 || resendOtpMutation.error?.status === 503
    ? t('register.emailSendError')
    : verifyOtpMutation.error?.status === 401
      ? t('register.invalidCode')
      : registerMutation.error?.message || verifyOtpMutation.error?.message || resendOtpMutation.error?.message || '';

  const clearAllErrors = () => {
    registerMutation.clearError();
    verifyOtpMutation.clearError();
    resendOtpMutation.clearError();
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
        open={Boolean(activeErrorMessage) && !emailAlreadyRegistered}
        severity="error"
        message={activeErrorMessage}
        onClose={clearAllErrors}
      />

      <AppConfirmDialog
        open={emailAlreadyRegistered}
        title={t('register.emailAlreadyRegisteredTitle')}
        description={t('register.emailAlreadyRegistered')}
        intent="primary"
        confirmText={t('register.loginNow')}
        cancelText={t('register.useAnotherEmail')}
        onConfirm={() => router.push('/login')}
        onClose={() => {
          registerMutation.clearError();
          emailInputRef.current?.focus();
        }}
      />

      <AppToast
        open={Boolean(successToast)}
        severity="success"
        message={successToast ?? ''}
        onClose={() => setSuccessToast(null)}
      />

      <Box sx={{ display: step === 'OTP' ? { xs: 'none', md: 'contents' } : 'contents' }}>
        <LoginBrandPanel />
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexGrow: 0.85,
          flexShrink: 1,
          flexBasis: 0,
          minWidth: { xs: 0, md: '440px' },
          alignItems: { xs: step === 'OTP' ? 'center' : 'flex-start', md: 'center' },
          justifyContent: 'center',
          p: { xs: '24px 24px max(32px, env(safe-area-inset-bottom))', sm: 5 },
          minHeight: { xs: step === 'OTP' ? '100svh' : 'calc(100svh - 240px)', sm: step === 'OTP' ? '100svh' : 'calc(100svh - 280px)', md: '100svh' },
          borderRadius: { xs: step === 'OTP' ? 0 : 'var(--app-radius-dialog) var(--app-radius-dialog) 0 0', md: 0 },
          bgcolor: 'background.paper',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 480,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {step === 'OTP' && (
            <Stack direction="row" sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
              <AppBrand showTag={false} />
              <AppPreferencesMenu />
            </Stack>
          )}

          {step === 'REGISTER' ? (
            <>
              <Typography
                component="h1"
                sx={{
                  color: 'text.primary',
                  fontFamily: 'var(--font-display)',
                  fontSize: { xs: '26px', sm: '32px' },
                  fontWeight: 600,
                }}
              >
                {t('register.title')}
              </Typography>
              <Typography color="text.secondary">
                {t('register.description')}
              </Typography>


              <Stack
                component="form"
                spacing={2}
                noValidate
                onSubmit={handleRegisterSubmit}
              >
                <AppTextField
                  label={t('register.name')}
                  name="name"
                  placeholder={t('register.namePlaceholder')}
                  autoComplete="name"
                  required
                  value={name}
                  error={Boolean(formErrors.name)}
                  helperText={formErrors.name}
                  inputRef={nameInputRef}
                  disabled={registerMutation.isPending}
                  onChange={(event) => {
                    setName(event.target.value);
                    setFormErrors((current) => ({
                      ...current,
                      name: undefined,
                    }));
                    registerMutation.clearError();
                  }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutlineOutlined fontSize="small" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />

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
                  disabled={registerMutation.isPending}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setFormErrors((current) => ({
                      ...current,
                      email: undefined,
                    }));
                    registerMutation.clearError();
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
                  placeholder={t('register.passwordPlaceholder')}
                  autoComplete="new-password"
                  required
                  value={password}
                  error={Boolean(formErrors.password)}
                  helperText={formErrors.password}
                  inputRef={passwordInputRef}
                  disabled={registerMutation.isPending}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setFormErrors((current) => ({
                      ...current,
                      password: undefined,
                    }));
                    registerMutation.clearError();
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
                            aria-label={
                              showPassword
                                ? t('login.hidePassword')
                                : t('login.showPassword')
                            }
                            edge="end"
                            onClick={() =>
                              setShowPassword((current) => !current)
                            }
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

                <AppButton
                  type="submit"
                  fullWidth
                  loading={registerMutation.isPending}
                  sx={{ minHeight: '54px', height: '54px' }}
                >
                  {t('register.submit')}
                </AppButton>
              </Stack>

              <Divider>
                <Typography variant="caption" color="text.secondary">
                  {t('login.orContinueWithEmail')}
                </Typography>
              </Divider>

              <GoogleAuthButton text="signup_with" />

              <Stack
                spacing="4px"
                direction="row"
                sx={{ justifyContent: 'center' }}
              >
                <Typography align="center" color="text.secondary">
                  {t('register.hasAccount')}
                </Typography>
                <Box
                  component={Link}
                  href="/login"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  {t('register.loginNow')}
                </Box>
              </Stack>
            </>
          ) : (
            <>
              <AppBackHeader
                title={t('register.verifyTitle')}
                titleAlign="left"
                backLabel={t('register.changeEmail')}
                backDisabled={busy}
                onBack={() => {
                  if (busy) return;
                  setStep('REGISTER');
                  setOtp('');
                  setFormErrors({});
                  setSuccessToast(null);
                  clearAllErrors();
                }}
              />
              <AppCard variant="outlined" sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: 'var(--app-radius-control)' }}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', minWidth: 0 }}>
                  <MarkEmailReadOutlined aria-hidden sx={{ color: 'primary.main', fontSize: 28, flexShrink: 0 }} />
                  <Stack spacing={0.5} sx={{ minWidth: 0 }}>
                    <Typography sx={{ color: 'text.secondary', fontSize: 12 }}>{t('register.verifyDescription')}</Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 700, overflowWrap: 'anywhere' }}>{email}</Typography>
                  </Stack>
                </Stack>
              </AppCard>
              <Stack component="form" spacing={2} noValidate onSubmit={handleVerifyOtpSubmit} aria-label={t('register.verifyTitle')}>
                <AppTextField
                  autoFocus
                  label={t('register.otpLabel')}
                  name="otp"
                  placeholder="000000"
                  autoComplete="one-time-code"
                  required
                  value={otp}
                  error={Boolean(formErrors.otp)}
                  helperText={formErrors.otp || t('register.codeExpiry')}
                  inputRef={otpInputRef}
                  disabled={busy}
                  onChange={(event) => {
                    setOtp(event.target.value.replace(/\D/g, '').slice(0, 6));
                    setFormErrors(current => ({ ...current, otp: undefined }));
                    verifyOtpMutation.clearError();
                  }}
                  slotProps={{ htmlInput: {
                    inputMode: 'numeric', pattern: '[0-9]{6}', maxLength: 6,
                    style: { letterSpacing: '8px', fontSize: '28px', fontWeight: 700, textAlign: 'center', fontVariantNumeric: 'tabular-nums' },
                  } }}
                />
                <AppButton type="submit" fullWidth loading={verifyOtpMutation.isPending} disabled={busy || otp.length !== 6} sx={{ minHeight: 48 }}>
                  {t('register.verifySubmit')}
                </AppButton>
                <Stack spacing={0.5} sx={{ alignItems: 'center', textAlign: 'center' }}>
                  <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>{t('register.notReceived')}</Typography>
                  <AppButton intent="text" size="small" disabled={countdown > 0 || busy} loading={resendOtpMutation.isPending} onClick={handleResendOtp} sx={{ minHeight: 44 }}>
                    {countdown > 0 ? t('register.resendCountdown', { seconds: countdown }) : t('register.resendOtp')}
                  </AppButton>
                  <Typography sx={{ fontSize: 12, color: 'text.secondary', lineHeight: 1.6 }}>{t('register.checkSpam')}</Typography>
                </Stack>
              </Stack>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Register;
