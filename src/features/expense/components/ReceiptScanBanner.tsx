'use client';

import { AppLoadingIndicator, AppButton } from '@/base/components/ui';

import React, { useState } from 'react';
import axios from 'axios';
import { Alert, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { useTranslations } from 'next-intl';
import { IMAGE_MIME_TYPES, MAX_IMAGE_BYTES } from '@/base/types';

import { useScanReceipt } from '../hooks/useScanReceipt';
import type { ScannedReceipt } from '../types';
import CameraCaptureDialog from './CameraCaptureDialog';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export interface ReceiptScanBannerProps {
  onScanSuccess: (scanned: ScannedReceipt, sourceImage?: File) => void;
  onScanError?: (errorMessage: string) => void;
  disabled?: boolean;
}

const ReceiptScanBanner = ({
  onScanSuccess,
  onScanError,
  disabled = false,
}: ReceiptScanBannerProps) => {
  const tForm = useTranslations('expense.form');
  const tReceipt = useTranslations('expense.receipt');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [attachmentSkipped, setAttachmentSkipped] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const { scanReceiptAsync, isPending: isScanning } = useScanReceipt();

  const processFile = async (file: Blob, defaultName = 'receipt.jpg') => {
    const sourceFile = file instanceof File
      ? file
      : new File([file], defaultName, { type: file.type });
    const formData = new FormData();
    formData.append('file', sourceFile);

    try {
      setErrorMessage(null);
      setAttachmentSkipped(false);
      const response = await scanReceiptAsync(formData);
      const scanned = response.data;
      if (scanned) {
        const canAttach = IMAGE_MIME_TYPES.includes(sourceFile.type) &&
          sourceFile.size > 0 && sourceFile.size <= MAX_IMAGE_BYTES;
        onScanSuccess(scanned, canAttach ? sourceFile : undefined);
        setAttachmentSkipped(!canAttach);
      }
    } catch (err: unknown) {
      console.error('Scan receipt error:', err);
      let errorMsg = tForm('scanReceiptError');
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err instanceof Error && err.message) {
        errorMsg = err.message;
      }

      setErrorMessage(errorMsg);
      onScanError?.(errorMsg);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    await processFile(file);
  };

  const handleCameraCapture = async (blob: Blob) => {
    await processFile(blob, 'camera_receipt.jpg');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Box
        sx={{
          p: 1.5,
          borderRadius: 2,
          border: '1px dashed',
          borderColor: isScanning ? 'primary.main' : 'divider',
          bgcolor: isScanning ? 'action.selected' : 'action.hover',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1.5,
              bgcolor: 'action.selected',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'primary.main',
              flexShrink: 0,
            }}
          >
            {isScanning ? (
              <AppLoadingIndicator />
            ) : (
              <AutoAwesomeOutlinedIcon fontSize="small" />
            )}
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.3 }}
            >
              {isScanning ? tForm('scanReceiptLoading') : tForm('scanReceipt')}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.3 }}
            >
              {tForm('scanReceiptDesc')}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexShrink: 0,
            alignSelf: { xs: 'stretch', sm: 'center' },
          }}
        >
          <AppButton
            size="small"
            intent="secondary"
            startIcon={<CameraAltOutlinedIcon fontSize="small" />}
            loading={isScanning}
            disabled={disabled || isScanning}
            onClick={() => setIsCameraOpen(true)}
            sx={{ flex: { xs: 1, sm: 'none' } }}
          >
            {tForm('takePhotoButton')}
          </AppButton>

          <AppButton
            component="label"
            role={undefined}
            tabIndex={-1}
            size="small"
            intent="secondary"
            startIcon={<UploadFileOutlinedIcon fontSize="small" />}
            disabled={disabled || isScanning}
            sx={{
              flex: { xs: 1, sm: 'none' },
              cursor: 'pointer',
            }}
          >
            {tForm('uploadFileButton')}
            <VisuallyHiddenInput
              type="file"
              accept="image/*,application/pdf"
              disabled={disabled || isScanning}
              onChange={handleFileSelect}
            />
          </AppButton>
        </Box>
      </Box>

      {attachmentSkipped && (
        <Alert severity="info" onClose={() => setAttachmentSkipped(false)}>
          {tReceipt('scanAttachmentSkipped')}
        </Alert>
      )}

      {errorMessage && (
        <Alert
          severity="error"
          onClose={() => setErrorMessage(null)}
          sx={{ py: 0.5, px: 1.5, fontSize: '0.8125rem' }}
        >
          {errorMessage}
        </Alert>
      )}

      <CameraCaptureDialog
        open={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />
    </Box>
  );
};

export default ReceiptScanBanner;
