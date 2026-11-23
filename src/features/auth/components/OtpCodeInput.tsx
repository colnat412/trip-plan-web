'use client';

import { useId, useRef, type RefObject } from 'react';
import { Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { AppTextField } from '@/base/components/ui';

interface OtpCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  firstInputRef: RefObject<HTMLInputElement | null>;
}

const OtpCodeInput = ({ value, onChange, disabled = false, error, firstInputRef }: OtpCodeInputProps) => {
  const t = useTranslations('register');
  const helperId = useId();
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length: 6 }, (_, index) => /\d/.test(value[index] ?? '') ? value[index] : '');
  const focus = (index: number) => inputs.current[Math.max(0, Math.min(index, 5))]?.focus();
  const publish = (next: string[]) => onChange(next.map(digit => digit || ' ').join('').trimEnd());
  const write = (index: number, text: string) => {
    if (disabled) return;
    const incoming = text.replace(/\D/g, '').slice(0, 6);
    if (!incoming) {
      publish(digits.map((digit, position) => position === index ? '' : digit));
      return;
    }
    const start = incoming.length === 6 ? 0 : index;
    const next = [...digits];
    for (let offset = 0; offset < incoming.length && start + offset < 6; offset++) {
      next[start + offset] = incoming[offset];
    }
    publish(next);
    focus(Math.min(start + incoming.length, 5));
  };

  return <Stack spacing={1} role="group" aria-label={t('otpLabel')} aria-describedby={helperId}>
    <Stack direction="row" spacing={1} dir="ltr" sx={{ width: '100%', minWidth: 0 }}>
      {digits.map((digit, index) => <AppTextField key={index}
        value={digit} disabled={disabled} error={Boolean(error)} autoFocus={index === 0}
        name={`otp-${index + 1}`} autoComplete={index === 0 ? 'one-time-code' : 'off'}
        inputRef={(element: HTMLInputElement | null) => {
          inputs.current[index] = element;
          if (index === 0) firstInputRef.current = element;
        }}
        onChange={event => write(index, event.target.value)}
        onFocus={event => event.target.select()}
        onPaste={event => {
          event.preventDefault();
          const text = event.clipboardData.getData('text');
          if (/\d/.test(text)) write(index, text);
        }}
        onKeyDown={event => {
          if (disabled) return;
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            focus(index + (event.key === 'ArrowLeft' ? -1 : 1));
          } else if (event.key === 'Backspace') {
            event.preventDefault();
            const target = digit || index === 0 ? index : index - 1;
            publish(digits.map((current, position) => position === target ? '' : current));
            focus(target);
          } else if (event.key === 'Delete') {
            event.preventDefault();
            write(index, '');
          }
        }}
        slotProps={{ htmlInput: {
          inputMode: 'numeric', pattern: '[0-9]*', maxLength: 6,
          'aria-label': t('otpDigit', { position: index + 1 }), 'aria-describedby': helperId,
          'aria-invalid': Boolean(error),
        } }}
        sx={{ flex: '1 1 0', minWidth: 0,
          '& .MuiOutlinedInput-root': { height: { xs: 52, sm: 56 }, borderRadius: 'var(--app-radius-control)' },
          '& .MuiOutlinedInput-input': { p: '0 !important', textAlign: 'center',
            fontSize: '22px !important', fontWeight: 600, fontVariantNumeric: 'tabular-nums' },
        }} />)}
    </Stack>
    <Typography id={helperId} role={error ? 'alert' : undefined} sx={{ fontSize: 12, color: error ? 'error.main' : 'text.secondary' }}>
      {error || t('codeExpiry')}
    </Typography>
  </Stack>;
};

export default OtpCodeInput;
