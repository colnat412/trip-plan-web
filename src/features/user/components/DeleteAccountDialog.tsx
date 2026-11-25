'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AppConfirmDialog, AppToast } from '@/base/components/ui';
import useDeleteAccountMutation from '../hooks/useDeleteAccountMutation';

export default function DeleteAccountDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations('deleteAccount');
  const mutation = useDeleteAccountMutation();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const submitting = useRef(false);
  const confirm = async () => {
    if (!open || submitting.current) return;
    submitting.current = true; setBusy(true); setError('');
    try {
      await mutation.mutateAsync({ confirmed: true });
      window.location.replace('/login');
    } catch {
      setError(t('failed'));
      submitting.current = false; setBusy(false);
    }
  };
  return <>
    <AppConfirmDialog open={open} onClose={() => { if (!submitting.current) onClose(); }}
      title={t('title')} description={t('description')} confirmText={t('confirm')}
      cancelText={t('cancel')} intent="danger" loading={busy} onConfirm={confirm} />
    <AppToast open={Boolean(error)} severity="error" message={error} onClose={() => setError('')} />
  </>;
}
