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
  ChevronLeftRounded,
} from '@mui/icons-material';

import { DEFAULT_AUTH_REDIRECT_PATH } from '@/base/constants';
import {
  AppButton,
  AppTextField,
  AppToast,
  AppConfirmDialog,
} from '@/base/components/ui';
import OtpCodeInput from './OtpCodeInput';
import AuthLayout from './AuthLayout';
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

  const busy =
    registerMutation.isPending ||
    verifyOtpMutation.isPending ||
    resendOtpMutation.isPending;

  useEffect(() => {
    if (step !== 'OTP') return;
    const updateCountdown = () => {
      const remaining = Math.max(
        0,
        Math.ceil((resendAvailableAt - Date.now()) / 1000),
      );
      setCountdown(remaining);
      if (remaining === 0) clearInterval(timer);
    };
    const timer = setInterval(updateCountdown, 1000);
    const onVisible = () => {
      if (!document.hidden) updateCountdown();
    };
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
  const activeErrorMessage =
    registerMutation.error?.status === 503 ||
    resendOtpMutation.error?.status === 503
      ? t('register.emailSendError')
      : verifyOtpMutation.error?.status === 401
        ? t('register.invalidCode')
        : registerMutation.error?.message ||
          verifyOtpMutation.error?.message ||
          resendOtpMutation.error?.message ||
          '';

  const clearAllErrors = () => {
    registerMutation.clearError();
    verifyOtpMutation.clearError();
    resendOtpMutation.clearError();
  };

  return (
    <AuthLayout showMascot={step === 'REGISTER'}>
      <AppConfirmDialog
        open={emailAlreadyRegistered}
        title={t('register.emailAlreadyRegisteredTitle')}
        description={t('register.emailAlreadyRegistered')}
        intent="primary"
        confirmText={t('login.submit')}
        cancelText={t('register.useAnotherEmail')}
        onClose={registerMutation.clearError}
        onCancel={registerMutation.clearError}
        onConfirm={() => router.push('/login')}
      />
      <AppToast
        open={Boolean(activeErrorMessage) && !emailAlreadyRegistered}
        severity="error"
        message={activeErrorMessage}
        onClose={clearAllErrors}
      />

      <AppToast
        open={Boolean(successToast)}
        severity="success"
        message={successToast ?? ''}
        onClose={() => setSuccessToast(null)}
      />

      {step === 'REGISTER' ? (
        <>
          <Typography
            component="h1"
            sx={{
              color: 'text.primary',
              fontFamily: 'var(--font-display)',
              fontSize: { xs: '24px', sm: '28px' },
              textAlign: 'center',
              fontWeight: 600,
            }}
          >
            {t('register.title')}
          </Typography>
          <Typography color="text.secondary" sx={{ textAlign: 'center', fontSize: 14 }}>
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
                  email:
                    event.target.value.trim() &&
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                      event.target.value.trim(),
                    )
                      ? t('validation.emailInvalid')
                      : undefined,
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
              sx={{ minHeight: 48 }}
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
            sx={{ justifyContent: 'center', flexWrap: 'wrap', rowGap: 0.5 }}
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
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <IconButton aria-label={t('register.changeEmail')} disabled={busy}
              sx={{ width: 44, height: 44, color: 'text.secondary' }}
              onClick={() => {
                if (busy) return;
                setStep('REGISTER');
                setOtp('');
                setFormErrors({});
                setSuccessToast(null);
                clearAllErrors();
              }}>
              <ChevronLeftRounded />
            </IconButton>
          </Stack>
          <Stack spacing={1}>
            <Typography component="h1" sx={{ fontSize: { xs: 22, sm: 24 }, fontWeight: 600, color: 'text.primary' }}>
              {t('register.verifyTitle')}
            </Typography>
            <Typography sx={{ fontSize: 14, color: 'text.secondary', lineHeight: 1.6 }}>
              {t('register.verifyDescription')}
              <Box component="span" sx={{ display: 'block', fontWeight: 600, color: 'text.primary', overflowWrap: 'anywhere' }}>{email}</Box>
            </Typography>
          </Stack>
          <Stack
            component="form"
            spacing={2}
            noValidate
            onSubmit={handleVerifyOtpSubmit}
            aria-label={t('register.verifyTitle')}
          >
            <OtpCodeInput
              value={otp}
              error={formErrors.otp}
              firstInputRef={otpInputRef}
              disabled={busy}
              onChange={(value) => {
                setOtp(value);
                setFormErrors(current => ({ ...current, otp: undefined }));
                verifyOtpMutation.clearError();
              }}
            />
            <AppButton
              type="submit"
              fullWidth
              loading={verifyOtpMutation.isPending}
              disabled={busy || !/^\d{6}$/.test(otp)}
              sx={{ minHeight: 48 }}
            >
              {t('register.verifySubmit')}
            </AppButton>
            <Stack
              spacing={0.5}
              sx={{ alignItems: 'center', textAlign: 'center' }}
            >
              <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                {t('register.notReceived')}
              </Typography>
              <AppButton
                intent="text"
                size="small"
                disabled={countdown > 0 || busy}
                loading={resendOtpMutation.isPending}
                onClick={handleResendOtp}
                sx={{ minHeight: 44 }}
              >
                {countdown > 0
                  ? t('register.resendCountdown', { seconds: countdown })
                  : t('register.resendOtp')}
              </AppButton>
            </Stack>
          </Stack>
        </>
      )}
    </AuthLayout>
  );
};

export default Register;
