'use client';

import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import {
  Avatar, Box, ButtonBase, CircularProgress, Stack, Typography,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { IMAGE_MIME_TYPES, MAX_IMAGE_BYTES } from '@/base/types';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import AppButton from './AppButton';

interface AppImageUploaderProps {
  src?: string | null;
  inputRef?: RefObject<HTMLInputElement | null>;
  file?: File | null;
  alt: string;
  fallback?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  onChange: (file: File | null) => void;
  variant?: 'avatar' | 'cover' | 'receipt';
  showHint?: boolean;
  compact?: boolean;
  layout?: 'field' | 'tile';
  previewSelection?: boolean;
}

const AppImageUploader = ({
  src,
  inputRef,
  file,
  alt,
  fallback,
  disabled = false,
  loading = false,
  onChange,
  variant = 'cover',
  showHint = true,
  compact = false,
  layout = 'field',
  previewSelection = true,
}: AppImageUploaderProps) => {
  const t = useTranslations('imageUpload');
  const localInput = useRef<HTMLInputElement>(null);
  const input = inputRef ?? localInput;
  const [localFile, setLocalFile] = useState<File | null | undefined>();
  const unavailable = disabled || loading;
  const selectedFile = file === undefined && previewSelection ? localFile : file;
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
    const image = new Image();
    const showPreview = () => setPreview({ file: selectedFile, url });
    image.onload = showPreview;
    image.onerror = showPreview;
    image.src = url;
    return () => {
      image.onload = null;
      image.onerror = null;
      URL.revokeObjectURL(url);
    };
  }, [selectedFile]);
  const displayed = selectedFile
    ? preview?.file === selectedFile
      ? preview.url
      : (src ?? undefined)
    : selectedFile === null
      ? undefined
      : (src ?? undefined);

  const fileInput = (
    <input
      ref={input}
      type="file"
      hidden
      accept={IMAGE_MIME_TYPES.join(',')}
      disabled={unavailable}
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
        if (file === undefined && previewSelection) setLocalFile(nextFile);
        onChange(nextFile);
      }}
    />
  );

  const removeImage = () => {
    if (file === undefined && previewSelection) setLocalFile(null);
    setValidationError(null);
    onChange(null);
  };

  if (layout === 'tile') {
    return (
      <Box
        aria-busy={loading}
        sx={{
          position: 'relative', display: 'flex', flex: 1,
          alignSelf: 'stretch', minHeight: 112, minWidth: 0,
          overflow: 'hidden', bgcolor: 'action.hover',
        }}
      >
        {fileInput}
        {displayed && (
          <Avatar
            src={displayed}
            alt={alt}
            variant="square"
            sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          >
            <ImageOutlinedIcon />
          </Avatar>
        )}
        <ButtonBase
          type="button"
          disabled={unavailable}
          onClick={() => input.current?.click()}
          aria-label={`${t(displayed ? 'change' : 'choose')}: ${alt}`}
          sx={{
            flex: 1, minWidth: 0, flexDirection: 'column', gap: 1,
            color: 'text.secondary',
            '&.Mui-focusVisible': {
              outline: '2px solid', outlineColor: 'primary.main', outlineOffset: -2,
            },
            '@media (hover: hover)': { '&:hover': { bgcolor: 'action.hover' } },
          }}
        >
          {!displayed && !loading && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 40, height: 40, border: '1px dashed', borderColor: 'divider', borderRadius: '12px' }}>
                <AddPhotoAlternateOutlinedIcon sx={{ fontSize: 22 }} />
              </Box>
              <Typography component="span" sx={{ fontSize: '11px', fontWeight: 500 }}>
                {t('choose')}
              </Typography>
            </>
          )}
        </ButtonBase>
        {loading && (
          <Box
            role="status"
            aria-live="polite"
            sx={{
              position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 1, px: 0.75,
              bgcolor: (theme) => `color-mix(in srgb, ${(theme.vars ?? theme).palette.background.paper} 82%, transparent)`,
              color: 'text.primary', pointerEvents: 'none',
            }}
          >
            <CircularProgress size={24} thickness={4} aria-hidden="true" />
            <Typography component="span" sx={{ fontSize: '11px', fontWeight: 600, textAlign: 'center' }}>
              {t('saving')}
            </Typography>
          </Box>
        )}
        {error && (
          <Typography
            role="alert"
            sx={{ position: 'absolute', bottom: 0, width: '100%', bgcolor: 'background.paper',
              color: 'error.main', fontSize: '11px', p: 0.5 }}
          >
            {error}
          </Typography>
        )}
      </Box>
    );
  }

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
            bgcolor: variant === 'avatar' ? 'primary.light' : 'action.hover',
            color:
              variant === 'avatar' ? 'primary.contrastText' : 'text.secondary',
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
          {fallback ?? <ImageOutlinedIcon sx={{ fontSize: 40 }} />}
        </Avatar>
      )}
      {fileInput}
      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
        <AppButton
          type="button"
          intent="secondary"
          size="small"
          disabled={unavailable}
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
            disabled={unavailable || !displayed}
            sx={compact ? { minHeight: 44 } : undefined}
            onClick={removeImage}
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
