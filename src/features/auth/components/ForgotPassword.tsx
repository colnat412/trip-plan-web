'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Box, IconButton, InputAdornment, Stack, Typography } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { useTranslations } from 'next-intl';
import { ApiError } from '@/base/api';
import { AppButton, AppLoadingState, AppTextField, AppToast } from '@/base/components/ui';
import AuthLayout from './AuthLayout';
import OtpCodeInput from './OtpCodeInput';
import usePasswordRecovery from '../hooks/usePasswordRecovery';
import { usePasswordRecoveryState } from '../context/PasswordRecoveryContext';

export default function ForgotPassword({ stage = 'EMAIL' }: { stage?: 'EMAIL' | 'OTP' | 'PASSWORD' }) {
  const t = useTranslations('forgotPassword');
  const validation = useTranslations('validation');
  const login = useTranslations('login');
  const router = useRouter();
  const recovery = usePasswordRecoveryState();
  const { send, verify, reset } = usePasswordRecovery();
  const [email, setEmail] = useState(recovery.email);
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [visible, setVisible] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<{ email?: string; otp?: string; password?: string; confirmation?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const pending = useRef(false);
  const otpRef = useRef<HTMLInputElement>(null);
  const busy = submitting || send.isPending || verify.isPending || reset.isPending;
  const { email: accountEmail, verified } = recovery;
  const ready = stage === 'EMAIL' || Boolean(accountEmail && (stage !== 'PASSWORD' || verified));

  useEffect(() => {
    if (stage !== 'EMAIL' && !accountEmail) router.replace('/forgot-password');
    else if (stage === 'PASSWORD' && !verified) router.replace('/forgot-password/verify');
    else if (stage === 'OTP' && verified) router.replace('/forgot-password/reset');
  }, [stage, accountEmail, verified, router]);

  const sendCode = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (busy || pending.current || (stage === 'OTP' && Date.now() < recovery.deadline)) return;
    const normalized = (stage === 'EMAIL' ? email : accountEmail).trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) || normalized.length > 254) {
      setErrors({ email: validation('emailInvalid') }); return;
    }
    pending.current = true; setSubmitting(true); setError(''); setErrors({});
    try {
      await send.mutateAsync({ email: normalized });
      recovery.setEmail(normalized); recovery.setVerified(false); recovery.startCooldown();
      setOtp('');
      if (stage === 'EMAIL') router.push('/forgot-password/verify');
      else otpRef.current?.focus();
    } catch { setError(t('sendFailed')); }
    finally { pending.current = false; setSubmitting(false); }
  };

  const verifyCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy || pending.current) return;
    if (!/^\d{6}$/.test(otp)) { setErrors({ otp: validation('otpRequired') }); return; }
    pending.current = true; setSubmitting(true); setError(''); setErrors({});
    try {
      await verify.mutateAsync({ email: accountEmail, otp });
      recovery.setVerified(true); setOtp(''); router.replace('/forgot-password/reset');
    } catch (failure) {
      if (failure instanceof ApiError && failure.status === 400) {
        setErrors({ otp: t('invalidCode') }); otpRef.current?.focus();
      } else setError(t('verifyFailed'));
    } finally { pending.current = false; setSubmitting(false); }
  };

  const submitReset = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy || pending.current || !verified) return;
    const next: typeof errors = {};
    if (!password.trim() || password.length < 8) next.password = validation('passwordMin');
    else if (new TextEncoder().encode(password).length > 72) next.password = t('passwordTooLong');
    if (!confirmation || password !== confirmation) next.confirmation = t('mismatch');
    setErrors(next); if (Object.keys(next).length) return;
    pending.current = true; setSubmitting(true); setError('');
    try {
      await reset.mutateAsync({ newPassword: password });
      setPassword(''); setConfirmation(''); setDone(true);
    } catch (failure) {
      if (failure instanceof ApiError && failure.status === 400) {
        setError(t('verificationExpired')); recovery.setVerified(false);
      } else setError(t('resetFailed'));
    } finally { pending.current = false; setSubmitting(false); }
  };

  if (!ready) return <AuthLayout showMascot={false}><AppLoadingState local /></AuthLayout>;
  return <AuthLayout>
    <Typography component="h1" sx={{ fontSize: { xs: 24, sm: 28 }, fontWeight: 600, textAlign: 'center' }}>
      {t(done ? 'successTitle' : stage === 'EMAIL' ? 'title' : stage === 'OTP' ? 'otpTitle' : 'resetTitle')}
    </Typography>
    <Typography sx={{ fontSize: 14, textAlign: 'center', color: 'text.secondary' }}>
      {t(done ? 'successDescription' : stage === 'EMAIL' ? 'description' : stage === 'OTP' ? 'codeDescription' : 'passwordDescription')}
    </Typography>
    {stage !== 'EMAIL' && !done && <Typography sx={{ fontSize: 14, fontWeight: 600, textAlign: 'center', overflowWrap: 'anywhere' }}>{accountEmail}</Typography>}
    {stage === 'EMAIL' && <Stack component="form" spacing={2} onSubmit={sendCode} noValidate aria-busy={busy}>
      <AppTextField label={login('email')} name="email" type="email" autoComplete="email" value={email} required disabled={busy}
        error={Boolean(errors.email)} helperText={errors.email} slotProps={{ htmlInput: { maxLength: 254 } }}
        onChange={event => { setEmail(event.target.value); setErrors({}); }} />
      <AppButton type="submit" fullWidth loading={busy} sx={{ minHeight: 48 }}>{t('continue')}</AppButton>
    </Stack>}
    {stage === 'OTP' && <Stack component="form" spacing={2} onSubmit={verifyCode} noValidate aria-busy={busy}>
      <OtpCodeInput value={otp} onChange={value => { setOtp(value); setErrors(current => ({ ...current, otp: undefined })); }}
        disabled={busy} error={errors.otp} firstInputRef={otpRef} />
      <AppButton type="submit" fullWidth loading={verify.isPending || submitting} disabled={busy || !/^\d{6}$/.test(otp)} sx={{ minHeight: 48 }}>{t('continue')}</AppButton>
      <Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <AppButton intent="text" size="small" disabled={busy || recovery.remaining > 0} onClick={() => void sendCode()}>
          {recovery.remaining > 0 ? t('resendCountdown', { seconds: recovery.remaining }) : t('resend')}
        </AppButton>
        <AppButton intent="text" size="small" disabled={busy} onClick={() => router.push('/forgot-password')}>{t('changeEmail')}</AppButton>
      </Stack>
    </Stack>}
    {stage === 'PASSWORD' && !done && <Stack component="form" spacing={2} onSubmit={submitReset} noValidate aria-busy={busy}>
      <AppTextField label={t('newPassword')} name="newPassword" type={visible ? 'text' : 'password'} autoComplete="new-password"
        required value={password} disabled={busy} error={Boolean(errors.password)} helperText={errors.password}
        onChange={event => { setPassword(event.target.value); setErrors(current => ({ ...current, password: undefined })); }}
        slotProps={{ input: { endAdornment: <InputAdornment position="end">
          <IconButton type="button" disabled={busy} edge="end" aria-label={login(visible ? 'hidePassword' : 'showPassword')} aria-pressed={visible}
            onMouseDown={event => event.preventDefault()} onClick={() => setVisible(value => !value)}>
            {visible ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
          </IconButton>
        </InputAdornment> }, htmlInput: { maxLength: 72 } }} />
      <AppTextField label={t('confirmPassword')} name="confirmPassword" type={visible ? 'text' : 'password'} autoComplete="new-password"
        required value={confirmation} disabled={busy} error={Boolean(errors.confirmation)} helperText={errors.confirmation}
        slotProps={{ htmlInput: { maxLength: 72 } }}
        onChange={event => { setConfirmation(event.target.value); setErrors(current => ({ ...current, confirmation: undefined })); }} />
      <AppButton type="submit" fullWidth loading={busy} sx={{ minHeight: 48 }}>{t('submit')}</AppButton>
    </Stack>}
    {done ? <AppButton component={Link} href="/login" fullWidth sx={{ minHeight: 48 }}>{t('backToLogin')}</AppButton>
      : <Box component={Link} href="/login" aria-disabled={busy || undefined} tabIndex={busy ? -1 : undefined}
        onClick={(event: React.MouseEvent<HTMLAnchorElement>) => { if (busy) event.preventDefault(); }}
        sx={{ display: 'flex', minHeight: 44, alignItems: 'center', justifyContent: 'center', fontSize: 14,
          color: busy ? 'text.disabled' : 'primary.main', textDecoration: 'none' }}>{t('backToLogin')}</Box>}
    <AppToast open={Boolean(error)} severity="error" message={error} onClose={() => setError('')} />
  </AuthLayout>;
}
