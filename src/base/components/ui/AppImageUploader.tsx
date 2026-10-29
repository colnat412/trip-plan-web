'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Avatar, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { IMAGE_MIME_TYPES, MAX_IMAGE_BYTES } from '@/base/types';
import AppButton from './AppButton';

interface AppImageUploaderProps {
  src?: string | null;
  alt: string;
  fallback?: ReactNode;
  disabled?: boolean;
  onChange: (file: File | null) => void;
  variant?: 'avatar' | 'cover' | 'receipt';
  showHint?: boolean;
}

const AppImageUploader = ({
  src,
  alt,
  fallback,
  disabled = false,
  onChange,
  variant = 'avatar',
  showHint = true,
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
    <Stack spacing={1.5} sx={{ alignItems: 'flex-start', ...(variant !== 'avatar' ? { width: '100%', minWidth: 0 } : {}) }}>
      <Avatar
        src={displayed}
        alt={alt}
        variant={variant === 'avatar' ? 'circular' : 'rounded'}
        sx={{
          width: variant === 'avatar' ? 80 : '100%',
          height: variant === 'receipt' ? 240 : variant === 'cover' ? 160 : 80,
          bgcolor: variant === 'receipt' ? 'action.hover' : 'primary.light',
          color: variant === 'receipt' ? 'text.secondary' : 'primary.contrastText',
          ...(variant === 'receipt' ? {
            border: 1, borderColor: 'divider',
            '& .MuiAvatar-img': { objectFit: 'contain' },
          } : {}),
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
      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
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
      {(error || showHint) && (
        <Typography
          variant="caption"
          color={error ? 'error' : 'text.secondary'}
          role={error ? 'alert' : undefined}
        >
          {error || t('hint')}
        </Typography>
      )}
    </Stack>
  );
};
export default AppImageUploader;
