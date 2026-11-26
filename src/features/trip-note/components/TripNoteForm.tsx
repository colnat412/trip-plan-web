'use client';

import { useEffect, useRef, useState } from 'react';
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { useTranslations } from 'next-intl';
import { AppImageUploader, AppTextArea } from '@/base/components/ui';
import { useUploadFile } from '@/base/hooks';
import useDialogDraft from '@/base/hooks/use-dialog-draft';
import type { TripNoteDraft } from '../types';

interface TripNoteFormProps {
  initialContent?: string;
  initialImageUrl?: string | null;
  busy: boolean;
  onSubmit: (draft: TripNoteDraft) => Promise<void>;
  editing?: boolean;
  onSavingChange?: (saving: boolean) => void;
}

export default function TripNoteForm({ initialContent = '', initialImageUrl, busy, onSubmit, onSavingChange, editing = false }: TripNoteFormProps) {
  const t = useTranslations('tripNotes');
  const upload = useUploadFile();
  const [content, setContent] = useState(initialContent);
  const [file, setFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [uploaded, setUploaded] = useState<{ file: File; id: string }>();
  const [saving, setSaving] = useState(false);
  const [uploadFailed, setUploadFailed] = useState(false);
  const imageInput = useRef<HTMLInputElement | null>(null);
  const inFlight = useRef(false);
  const disabled = busy || saving;
  const imagePresent = Boolean(file || (initialImageUrl && !removeImage));
  const changed = content.trim() !== initialContent.trim() || Boolean(file) || Boolean(initialImageUrl && removeImage);
  const canSend = (Boolean(content.trim()) || imagePresent) && content.length <= 2000 && (!editing || changed);
  useDialogDraft(() => ({ content, image: file ? [file.name, file.size, file.lastModified] : null, removeImage }));
  useEffect(() => {
    if (!changed || (!content.trim() && !imagePresent && !removeImage)) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [changed, content, imagePresent, removeImage]);

  return <Box component="form" onSubmit={async event => {
    event.preventDefault();
    if (disabled || inFlight.current || !canSend) return;
    inFlight.current = true;
    setSaving(true);
    onSavingChange?.(true);
    setUploadFailed(false);
    try {
      let imageUploadId = file && uploaded?.file === file ? uploaded.id : undefined;
      if (file && !imageUploadId) {
        try {
          const result = await upload.mutateAsync({ file, purpose: 'TRIP_NOTE_IMAGE' });
          imageUploadId = result.data.uploadId;
          setUploaded({ file, id: imageUploadId });
        } catch { setUploadFailed(true); return; }
      }
      await onSubmit({ content: content.trim(), ...(imageUploadId ? { imageUploadId } : {}), ...(editing ? { removeImage } : {}) });
      if (!editing) { setContent(''); setFile(null); setUploaded(undefined); setRemoveImage(false); }
    } catch { /* Keep text and image for retry; the parent displays request errors. */ }
    finally { inFlight.current = false; setSaving(false); onSavingChange?.(false); }
  }}>
    <Stack spacing={1}>
      <Box sx={{ display: imagePresent ? 'block' : 'none', width: 96, height: 96, overflow: 'hidden', borderRadius: 'var(--app-radius-control)' }}>
        <AppImageUploader inputRef={imageInput} src={removeImage ? undefined : initialImageUrl} file={file}
          alt={t('image')} layout="tile" compact removeAction="icon" allowCamera={false}
          disabled={disabled} showHint={false} onChange={value => { setFile(value); setRemoveImage(!value); }} />
      </Box>
      {uploadFailed && <Typography role="alert" color="error" sx={{ fontSize: 12 }}>{t('uploadError')}</Typography>}
      <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', minWidth: 0 }}>
        <Tooltip title={t('addImage')}><span><IconButton aria-label={t('addImage')} disabled={disabled}
          onClick={() => imageInput.current?.click()} sx={{ width: 44, height: 44 }}><AddPhotoAlternateOutlinedIcon sx={{ fontSize: 20 }} /></IconButton></span></Tooltip>
        <AppTextArea placeholder={t('content')}
          value={content} onChange={event => setContent(event.target.value)} disabled={disabled}
          minRows={1} maxRows={4} fullWidth size="small"
          slotProps={{ htmlInput: { maxLength: 2000, 'aria-label': t(editing ? 'editContent' : 'content') } }}
          sx={{
            '& .MuiOutlinedInput-root': { minHeight: 40, px: 1.25, py: 1 },
            '& textarea.MuiInputBase-input': { p: 0, lineHeight: 1.4, fontSize: { xs: 16, sm: 14 } },
          }}
          helperText={content.length > 1800 ? t('characterCount', { count: content.length }) : undefined} />
        <Tooltip title={t(editing ? 'save' : 'post')}><span><IconButton type="submit" aria-label={t(editing ? 'save' : 'post')} disabled={disabled || !canSend}
          sx={{ width: 44, height: 44, color: 'primary.main' }}>
          {editing ? <CheckRoundedIcon sx={{ fontSize: 20 }} /> : <SendRoundedIcon sx={{ fontSize: 20 }} />}
        </IconButton></span></Tooltip>
      </Stack>
    </Stack>
  </Box>;
}
