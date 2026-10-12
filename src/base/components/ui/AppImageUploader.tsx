'use client';

import { useEffect, useRef, useState } from 'react';
import { Avatar, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { IMAGE_MIME_TYPES, MAX_IMAGE_BYTES } from '@/base/types';
import AppButton from './AppButton';

interface AppImageUploaderProps {
  src?: string | null;
  alt: string;
  fallback?: string;
  disabled?: boolean;
  onChange: (file: File | null) => void;
  variant?: 'avatar' | 'cover';
}

const AppImageUploader = ({
  src,
  alt,
  fallback,
  disabled = false,
  onChange,
  variant = 'avatar',
}: AppImageUploaderProps) => {
  const t = useTranslations('imageUpload');
  const input = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>();
  const [removed, setRemoved] = useState(false);
  const [error, setError] = useState('');
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );
  const displayed = removed ? undefined : (preview ?? src ?? undefined);

  return (
    <Stack spacing={1.5} sx={{ alignItems: 'flex-start' }}>
      <Avatar
        src={displayed}
        alt={alt}
        variant={variant === 'cover' ? 'rounded' : 'circular'}
        sx={{
          width: variant === 'cover' ? '100%' : 80,
          height: variant === 'cover' ? 160 : 80,
          bgcolor: 'primary.light',
          fontSize: 24,
        }}
      >
        {fallback}
      </Avatar>
      <input
        ref={input}
        type="file"
        hidden
        accept={IMAGE_MIME_TYPES.join(',')}
        disabled={disabled}
        aria-label={t('choose')}
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = '';
          if (!file) return;
          if (!IMAGE_MIME_TYPES.includes(file.type)) {
            setError(t('invalidType'));
            return;
          }
          if (!file.size || file.size > MAX_IMAGE_BYTES) {
            setError(t('invalidSize'));
            return;
          }
          setError('');
          setRemoved(false);
          setPreview(URL.createObjectURL(file));
          onChange(file);
        }}
      />
      <Stack direction="row" spacing={1}>
        <AppButton
          type="button"
          intent="secondary"
          size="small"
          disabled={disabled}
          onClick={() => input.current?.click()}
        >
          {t('choose')}
        </AppButton>
        <AppButton
          type="button"
          intent="text"
          size="small"
          disabled={disabled || !displayed}
          onClick={() => {
            setRemoved(true);
            setPreview(undefined);
            setError('');
            onChange(null);
          }}
        >
          {t('remove')}
        </AppButton>
      </Stack>
      <Typography
        variant="caption"
        color={error ? 'error' : 'text.secondary'}
        role={error ? 'alert' : undefined}
      >
        {error || t('hint')}
      </Typography>
    </Stack>
  );
};
export default AppImageUploader;
