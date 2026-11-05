'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Avatar, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { IMAGE_MIME_TYPES, MAX_IMAGE_BYTES } from '@/base/types';
import AppButton from './AppButton';

interface AppImageUploaderProps {
  src?: string | null;
  file?: File | null;
  alt: string;
  fallback?: ReactNode;
  disabled?: boolean;
  onChange: (file: File | null) => void;
  variant?: 'avatar' | 'cover' | 'receipt';
  showHint?: boolean;
  compact?: boolean;
}

const AppImageUploader = ({
  src,
  file,
  alt,
  fallback,
  disabled = false,
  onChange,
  variant = 'avatar',
  showHint = true,
  compact = false,
}: AppImageUploaderProps) => {
  const t = useTranslations('imageUpload');
  const input = useRef<HTMLInputElement>(null);
  const [localFile, setLocalFile] = useState<File | null | undefined>();
  const selectedFile = file === undefined ? localFile : file;
  const [preview, setPreview] = useState<{ file: File; url: string }>();
  const [validationError, setValidationError] = useState<{
    file: File | null | undefined;
    message: string;
  } | null>(null);
  const error =
    validationError?.file === selectedFile
      ? (validationError?.message ?? '')
      : '';
  useEffect(() => {
    if (!selectedFile) return;
    const url = URL.createObjectURL(selectedFile);
    setPreview({ file: selectedFile, url });
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);
  const displayed = selectedFile
    ? preview?.file === selectedFile
      ? preview.url
      : undefined
    : selectedFile === null
      ? undefined
      : (src ?? undefined);

  return (
    <Stack
      spacing={1.5}
      sx={{
        alignItems: 'flex-start',
        ...(variant !== 'avatar' ? { width: '100%', minWidth: 0 } : {}),
      }}
    >
      {(!compact || displayed) && (
        <Avatar
          src={displayed}
          alt={alt}
          variant={variant === 'avatar' ? 'circular' : 'rounded'}
          sx={{
            width: variant === 'avatar' ? 80 : '100%',
            height:
              variant === 'receipt'
                ? compact
                  ? 160
                  : 240
                : variant === 'cover'
                  ? 160
                  : 80,
            bgcolor: variant === 'receipt' ? 'action.hover' : 'primary.light',
            color:
              variant === 'receipt' ? 'text.secondary' : 'primary.contrastText',
            ...(variant === 'receipt'
              ? {
                  border: 1,
                  borderColor: 'divider',
                  '& .MuiAvatar-img': { objectFit: 'contain' },
                }
              : {}),
            fontSize: 24,
          }}
        >
          {fallback}
        </Avatar>
      )}
      <input
        ref={input}
        type="file"
        hidden
        accept={IMAGE_MIME_TYPES.join(',')}
        disabled={disabled}
        aria-label={t('choose')}
        onChange={(event) => {
          const nextFile = event.target.files?.[0];
          event.target.value = '';
          if (!nextFile) return;
          if (!IMAGE_MIME_TYPES.includes(nextFile.type)) {
            setValidationError({
              file: selectedFile,
              message: t('invalidType'),
            });
            return;
          }
          if (!nextFile.size || nextFile.size > MAX_IMAGE_BYTES) {
            setValidationError({
              file: selectedFile,
              message: t('invalidSize'),
            });
            return;
          }
          setValidationError(null);
          if (file === undefined) setLocalFile(nextFile);
          onChange(nextFile);
        }}
      />
      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
        <AppButton
          type="button"
          intent="secondary"
          size="small"
          disabled={disabled}
          sx={compact ? { minHeight: 44 } : undefined}
          onClick={() => input.current?.click()}
        >
          {t('choose')}
        </AppButton>
        {(!compact || displayed) && (
          <AppButton
            type="button"
            intent="text"
            size="small"
            disabled={disabled || !displayed}
            sx={compact ? { minHeight: 44 } : undefined}
            onClick={() => {
              if (file === undefined) setLocalFile(null);
              setValidationError(null);
              onChange(null);
            }}
          >
            {t('remove')}
          </AppButton>
        )}
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
