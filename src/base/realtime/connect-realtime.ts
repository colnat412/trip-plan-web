import { Client, ReconnectionTimeMode } from '@stomp/stompjs';
import { axiosGet, normalizeApiError, type ApiResponse } from '@/base/api';

export interface RealtimeSignal { schemaVersion: 1; eventId: string; type: string }
interface Options {
  onSignal: (event: RealtimeSignal) => void;
  onConnected: () => void;
  onStatus: (connected: boolean) => void;
}

export function connectRealtime(options: Options) {
  const url = new URL('/realtime', window.location.origin);
  url.protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  let disposed = false;
  let retryTimer: ReturnType<typeof setTimeout> | undefined;
  const seen = new Set<string>();
  const client = new Client({
    brokerURL: url.toString(),
    reconnectDelay: 1000 + Math.random() * 1000,
    reconnectTimeMode: ReconnectionTimeMode.EXPONENTIAL,
    maxReconnectDelay: 30000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    connectionTimeout: 10000,
    // Do not log STOMP frames: CONNECT contains the CSRF credential.
    debug: () => undefined,
  });
  client.beforeConnect = async () => {
    try {
      const response = await axiosGet<ApiResponse<{ headerName: string; token: string }>>('/realtime/bootstrap');
      if (!disposed) client.connectHeaders = { [response.data.headerName]: response.data.token };
    } catch (error) {
      if (disposed) return;
      options.onStatus(false);
      await client.deactivate();
      const status = normalizeApiError(error).status;
      if (status !== 401 && status !== 403) {
        retryTimer = setTimeout(() => { if (!disposed) client.activate(); }, 5000 + Math.random() * 1000);
      }
    }
  };
  client.onConnect = () => {
    if (disposed) return;
    client.subscribe('/user/queue/notifications', (message) => {
      if (disposed) return;
      try {
        const event: unknown = JSON.parse(message.body);
        if (!event || typeof event !== 'object') return;
        const value = event as Record<string, unknown>;
        if (value.schemaVersion !== 1 || typeof value.eventId !== 'string'
          || !['notification.created', 'notification.read-state-changed'].includes(String(value.type))
          || seen.has(value.eventId)) return;
        seen.add(value.eventId);
        if (seen.size > 500) seen.delete(seen.values().next().value!);
        options.onSignal(value as unknown as RealtimeSignal);
      } catch { /* Ignore frames outside the versioned contract. */ }
    });
    options.onStatus(true);
    options.onConnected();
  };
  client.onWebSocketClose = () => { if (!disposed) options.onStatus(false); };
  client.onStompError = () => {
    if (!disposed) options.onStatus(false);
    void client.deactivate();
  };
  client.activate();
  return () => { disposed = true; clearTimeout(retryTimer); void client.deactivate(); };
}
