'use client';

import { useRef, useState } from 'react';
import { useUploadFile } from '@/base/hooks';
import { useUpdateActivityImage } from './usePlanMutation';

const useActivityImage = (activity: {
  id?: string;
  tripId?: string;
  imageUrl?: string | null;
}, readOnly: boolean, onSaved?: () => void) => {
  const upload = useUploadFile();
  const inFlight = useRef(false);
  const identity = `${activity.tripId}/${activity.id}`;
  const [pending, setPending] = useState<{ identity: string; file?: File }>();
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const [saved, setSaved] = useState<{ identity: string; previous?: string | null; url?: string | null }>();
  // Once server props change, retire the local result permanently. Otherwise an old
  // result can reappear when a later edit removes the image and returns to its previous URL.
  if (saved && (saved.identity !== identity || saved.previous !== activity.imageUrl)) {
    setSaved(undefined);
  }
  const mutation = useUpdateActivityImage(activity.tripId ?? '', activity.id ?? '');
  const changeImage = async (file: File | null) => {
    if (readOnly || !activity.id || !activity.tripId || inFlight.current) return;
    inFlight.current = true;
    setPending({ identity, file: file ?? undefined });
    setBusy(true);
    setFailed(false);
    try {
      const uploaded = file ? await upload.mutateAsync({ file, purpose: 'ACTIVITY_IMAGE' }) : undefined;
      const response = await mutation.mutateAsync({ imageUploadId: uploaded?.data.uploadId, removeImage: !file });
      setSaved({ identity, previous: activity.imageUrl, url: response.data.imageUrl });
      onSaved?.();
    } catch {
      setFailed(true);
    } finally {
      inFlight.current = false;
      setBusy(false);
      setPending(undefined);
    }
  };
  return {
    src: saved?.identity === identity && saved.previous === activity.imageUrl ? saved.url : activity.imageUrl,
    pendingFile: busy && pending?.identity === identity ? pending.file : undefined,
    busy,
    failed,
    clearError: () => setFailed(false),
    changeImage,
  };
};

export default useActivityImage;
