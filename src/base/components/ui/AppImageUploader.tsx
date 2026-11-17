'use client';

import { useEffect, useRef, useState, type ChangeEvent, type MouseEvent, type ReactNode, type RefObject } from 'react';
import {
  Avatar, Box, ButtonBase, CircularProgress, IconButton, Stack, Tooltip, Typography,
} from '@mui/material';
import { useTranslations } from 'next-intl';
import { IMAGE_MIME_TYPES, MAX_IMAGE_BYTES } from '@/base/types';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import UploadRoundedIcon from '@mui/icons-material/UploadRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import AppButton from './AppButton';
import AppToast from './AppToast';
import AppPopover from './AppPopover';

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
  allowCamera?: boolean;
  removeAction?: 'icon' | 'button' | 'none';
  emptyLabel?: string;
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
  allowCamera = variant === 'cover' && layout === 'field',
  removeAction = layout === 'tile' ? 'none' : variant === 'cover' ? 'button' : 'icon',
  emptyLabel,
}: AppImageUploaderProps) => {
  const t = useTranslations('imageUpload');
  const localInput = useRef<HTMLInputElement>(null);
  const input = inputRef ?? localInput;
  const cameraInput = useRef<HTMLInputElement>(null);
  const [sourceAnchor, setSourceAnchor] = useState<HTMLElement | null>(null);
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

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (unavailable) return;
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
  };
  const chooseImage = (event: MouseEvent<HTMLElement>) => {
    if (unavailable) return;
    if (allowCamera) setSourceAnchor(event.currentTarget);
    else input.current?.click();
  };
  const fileInput = (
    <input ref={input} type="file" hidden accept={IMAGE_MIME_TYPES.join(',')}
      disabled={unavailable} aria-label={t('choose')} onChange={handleFileChange}
    />
  );
  const sourcePicker = allowCamera && <>
    <input ref={cameraInput} type="file" hidden accept={IMAGE_MIME_TYPES.join(',')} capture="environment"
      disabled={unavailable} aria-label={t('camera')} onChange={handleFileChange} />
    <AppPopover open={Boolean(sourceAnchor) && !unavailable} anchorEl={sourceAnchor} onClose={() => setSourceAnchor(null)}
      label={t('choose')} width={240} disableRestoreFocus>
      <Stack spacing={0.5}>
        <AppButton intent="text" size="small" startIcon={<CameraAltOutlinedIcon />} disabled={unavailable}
          onClick={() => { setSourceAnchor(null); cameraInput.current?.click(); }} sx={{ minHeight: 44, justifyContent: 'flex-start' }}>
          {t('camera')}
        </AppButton>
        <AppButton intent="text" size="small" startIcon={<UploadRoundedIcon />} disabled={unavailable}
          onClick={() => { setSourceAnchor(null); input.current?.click(); }} sx={{ minHeight: 44, justifyContent: 'flex-start' }}>
          {t('upload')}
        </AppButton>
      </Stack>
    </AppPopover>
  </>;

  const removeImage = () => {
    if (file === undefined && previewSelection) setLocalFile(null);
    setValidationError(null);
    onChange(null);
  };

  if (layout === 'tile' || variant === 'cover') {
    const frame = (
      <Box
        aria-busy={loading}
        data-image-upload-frame
        data-image-present={Boolean(displayed)}
        sx={{
          position: 'relative', display: 'flex', flex: 1,
          alignSelf: 'stretch', minHeight: compact ? 0 : 112, minWidth: 0, height: compact ? '100%' : undefined,
          overflow: 'hidden', bgcolor: 'action.hover',
          ...(layout === 'field' && {
            width: '100%', height: compact ? 128 : 160, flex: '0 0 auto',
            border: '1px solid', borderStyle: displayed ? 'solid' : 'dashed', borderColor: 'divider',
            borderRadius: 'var(--app-radius-control)',
          }),
        }}
      >
        {fileInput}
        {sourcePicker}
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
          onClick={chooseImage}
          aria-label={`${t(displayed ? 'change' : 'choose')}: ${alt}`}
          sx={{
            flex: 1, minWidth: 0, flexDirection: emptyLabel && layout === 'field' ? 'row' : 'column', gap: 1,
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
                width: compact ? 32 : 40, height: compact ? 32 : 40, border: '1px dashed', borderColor: 'divider', borderRadius: 'var(--app-radius-control)' }}>
                <AddPhotoAlternateOutlinedIcon sx={{ fontSize: 22 }} />
              </Box>
              {(!compact || emptyLabel) && <Typography component="span" sx={{ fontSize: emptyLabel ? '14px' : '11px', fontWeight: 500 }}>{emptyLabel ?? t('choose')}</Typography>}
            </>
          )}
        </ButtonBase>
        {displayed && removeAction === 'icon' && (
          <Tooltip title={t('remove')}>
            <IconButton aria-label={t('remove')} disabled={unavailable} onClick={removeImage}
              sx={{ position: 'absolute', top: 4, right: 4, width: 44, height: 44, bgcolor: 'background.paper', color: 'error.main',
                '&:hover': { bgcolor: 'background.paper' }, '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main' } }}>
              <DeleteOutlineRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        {loading && (
          <Box
            role="status"
            aria-label={t('saving')}
            aria-live="polite"
            sx={{
              position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 1, px: 0.75,
              bgcolor: (theme) => `color-mix(in srgb, ${(theme.vars ?? theme).palette.background.paper} 82%, transparent)`,
              color: 'text.primary', pointerEvents: 'none',
            }}
          >
            <CircularProgress size={24} thickness={4} aria-hidden="true" />
            {!compact && <Typography component="span" sx={{ fontSize: '11px', fontWeight: 600, textAlign: 'center' }}>{t('saving')}</Typography>}
          </Box>
        )}
        {error && compact && <AppToast open message={error} severity="error" autoHideDuration={null} onClose={() => setValidationError(null)} />}
        {error && !compact && (
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
    return layout === 'tile' ? frame : <Stack spacing={1} sx={{ width: '100%', minWidth: 0 }}>
      {frame}
      {displayed && removeAction === 'button' && (
        <AppButton type="button" intent="text" size="small" disabled={unavailable} onClick={removeImage}
          sx={{ alignSelf: 'flex-end', minHeight: 44, px: 1, fontSize: '12px', color: 'text.secondary',
            '&:hover': { color: 'error.main' } }}>
          {t('remove')}
        </AppButton>
      )}
      {showHint && !error && <Typography variant="caption" color="text.secondary">{t('hint')}</Typography>}
    </Stack>;
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
      {sourcePicker}
      <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
        <AppButton
          type="button"
          intent="secondary"
          size="small"
          disabled={unavailable}
          sx={compact ? { minHeight: 44 } : undefined}
          onClick={chooseImage}
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
