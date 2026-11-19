import { axiosPost, type ApiResponse } from '@/base/api';
import { firebaseConfig, publicVapidKey } from './firebase-config';

const installationKey = 'vivu:push-installation';
const deviceKey = 'vivu:push-device';

const getInstallation = () => {
  let id = localStorage.getItem(installationKey);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(installationKey, id);
  }
  return id;
};

export const getFirebaseMessaging = async () => {
  if (!window.isSecureContext || !('Notification' in window) || !('serviceWorker' in navigator) ||
      !firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.appId || !publicVapidKey) return null;
  const sdk = await import('firebase/messaging');
  if (!(await sdk.isSupported())) return null;
  const { getApps, initializeApp } = await import('firebase/app');
  const app = getApps().find(app => app.name === 'vivu-notifications') ?? initializeApp(firebaseConfig, 'vivu-notifications');
  return { sdk, messaging: sdk.getMessaging(app) };
};

export const connectPush = async ({ accountKey, signal, onMessage, onError }: {
  accountKey: string;
  signal: AbortSignal;
  onMessage: (notificationId: string) => void;
  onError: () => void;
}) => {
  const connection = await getFirebaseMessaging();
  if (!connection) { if (!signal.aborted) onError(); return () => {}; }
  if (signal.aborted || Notification.permission !== 'granted') return () => {};
  const { sdk, messaging } = connection;
  const worker = await navigator.serviceWorker.register('/firebase-messaging-sw.js', { scope: '/' });
  if (!worker.active) {
    await new Promise<void>((resolve, reject) => {
      const timeout = window.setTimeout(() => { cleanup(); reject(new Error('Worker activation timeout')); }, 15000);
      const check = () => { if (worker.active) { cleanup(); resolve(); } };
      const abort = () => { cleanup(); reject(new DOMException('Aborted', 'AbortError')); };
      const cleanup = () => {
        clearTimeout(timeout);
        worker.removeEventListener('updatefound', check);
        signal.removeEventListener('abort', abort);
        clearInterval(poll);
      };
      const poll = window.setInterval(check, 100);
      worker.addEventListener('updatefound', check);
      signal.addEventListener('abort', abort, { once: true });
      check();
    });
  }
  if (signal.aborted) return () => {};
  let uploadVersion = 0;
  let retryTimer: number | undefined;
  let latestFid: string | null = null;
  const upload = async (fid: string, attempt = 0) => {
    const version = ++uploadVersion;
    clearTimeout(retryTimer);
    try {
      const response = await axiosPost<ApiResponse<{ id: string }>>('/push-devices', {
        installationId: getInstallation(), addressType: 'FCM_FID', addressValue: fid,
      }, { signal });
      if (!signal.aborted && version === uploadVersion) {
        localStorage.setItem(deviceKey, JSON.stringify({ id: response.data.id, accountKey }));
      }
    } catch {
      if (signal.aborted || version !== uploadVersion) return;
      onError();
      if (attempt < 3) retryTimer = window.setTimeout(() => void upload(fid, attempt + 1), 5000 * (attempt + 1));
    }
  };
  const stopRegistered = sdk.onRegistered(messaging, fid => {
    latestFid = fid;
    void upload(fid);
  });
  const stopMessage = sdk.onMessage(messaging, message => {
    const id = message.data?.notificationId;
    if (!signal.aborted && id && message.data?.recipientId === accountKey) onMessage(id);
  });
  const online = () => { if (latestFid && !signal.aborted) void upload(latestFid); };
  window.addEventListener('online', online);
  const dispose = () => {
    stopRegistered(); stopMessage();
    clearTimeout(retryTimer);
    window.removeEventListener('online', online);
  };
  signal.addEventListener('abort', dispose, { once: true });
  try {
    await sdk.register(messaging, { vapidKey: publicVapidKey, serviceWorkerRegistration: worker });
  } catch (error) {
    dispose();
    throw error;
  }
  return dispose;
};

export const revokeLocalPush = async () => {
  const connection = await getFirebaseMessaging();
  if (connection) await connection.sdk.unregister(connection.messaging);
  localStorage.removeItem(deviceKey);
};

export const getRegisteredDeviceId = (accountKey: string): string | null => {
  try {
    const stored = JSON.parse(localStorage.getItem(deviceKey) ?? 'null');
    return stored?.accountKey === accountKey && typeof stored.id === 'string' ? stored.id : null;
  } catch { return null; }
};
