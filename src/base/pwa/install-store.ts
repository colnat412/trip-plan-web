interface InstallPromptEvent extends Event {
  prompt: () => Promise<unknown>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

type InstallStatus = 'unavailable' | 'prompt' | 'ios' | 'installed';

interface InstallState {
  status: InstallStatus;
  isInstalling: boolean;
  hasError: boolean;
}

const initialState: InstallState = {
  status: 'unavailable',
  isInstalling: false,
  hasError: false,
};

let state = initialState;
let deferredPrompt: InstallPromptEvent | null = null;
let installedInSession = false;
const subscribers = new Set<() => void>();

const publish = (next: InstallState) => {
  if (
    state.status === next.status &&
    state.isInstalling === next.isInstalling &&
    state.hasError === next.hasError
  ) return;

  state = next;
  subscribers.forEach((subscriber) => subscriber());
};

export const getInstallState = () => state;
export const getServerInstallState = () => initialState;

export const subscribeToInstall = (subscriber: () => void) => {
  subscribers.add(subscriber);
  return () => { subscribers.delete(subscriber); };
};

// Started once by the root layout, before account menus are opened.
export const listenForInstall = () => {
  const displayMode = window.matchMedia('(display-mode: standalone)');
  const fullscreenMode = window.matchMedia('(display-mode: fullscreen)');
  const iosNavigator = navigator as Navigator & { standalone?: boolean };
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  const refresh = () => {
    const installed = installedInSession || displayMode.matches ||
      fullscreenMode.matches || iosNavigator.standalone === true;
    if (installed) deferredPrompt = null;
    const status: InstallStatus = installed ? 'installed'
      : !window.isSecureContext ? 'unavailable'
      : deferredPrompt ? 'prompt'
      : isIOS ? 'ios'
      : 'unavailable';
    publish({ ...state, status });
  };

  const beforeInstall = (event: Event) => {
    if (!window.isSecureContext || installedInSession || displayMode.matches ||
      fullscreenMode.matches || iosNavigator.standalone) return;
    event.preventDefault();
    deferredPrompt = event as InstallPromptEvent;
    publish({ status: 'prompt', isInstalling: state.isInstalling, hasError: false });
  };

  const installed = () => {
    installedInSession = true;
    deferredPrompt = null;
    publish({ status: 'installed', isInstalling: false, hasError: false });
  };

  window.addEventListener('beforeinstallprompt', beforeInstall);
  window.addEventListener('appinstalled', installed);
  window.addEventListener('pageshow', refresh);
  displayMode.addEventListener('change', refresh);
  fullscreenMode.addEventListener('change', refresh);
  refresh();

  return () => {
    window.removeEventListener('beforeinstallprompt', beforeInstall);
    window.removeEventListener('appinstalled', installed);
    window.removeEventListener('pageshow', refresh);
    displayMode.removeEventListener('change', refresh);
    fullscreenMode.removeEventListener('change', refresh);
    deferredPrompt = null;
  };
};

export const requestInstallation = async () => {
  if (!deferredPrompt || state.isInstalling || state.status === 'installed') return;
  const event = deferredPrompt;
  // Each browser event can only be prompted once; consume it before awaiting.
  deferredPrompt = null;
  publish({ status: 'prompt', isInstalling: true, hasError: false });
  let hasError = false;
  try {
    await event.prompt();
    await event.userChoice;
  } catch {
    hasError = true;
  } finally {
    // appinstalled can update the store while the browser prompt is open.
    const current = getInstallState();
    publish({
      status: current.status === 'installed' ? 'installed'
        : deferredPrompt ? 'prompt' : 'unavailable',
      isInstalling: false,
      hasError: current.status !== 'installed' && hasError,
    });
  }
};

export const clearInstallError = () => publish({ ...state, hasError: false });
