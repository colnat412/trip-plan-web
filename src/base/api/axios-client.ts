import axios, { type InternalAxiosRequestConfig } from 'axios';
import { API_URL, PUBLIC_PATHS } from '../constants';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const axiosClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

let isRefreshing = false;
let isRedirectingToLogin = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const redirectToLogin = async (clearCookies = false) => {
  if (typeof window === 'undefined' || isRedirectingToLogin) return;
  const path = window.location.pathname;
  if (path === '/login' || path === '/register' || PUBLIC_PATHS.some(page => path === page || path.startsWith(`${page}/`))) return;
  isRedirectingToLogin = true;
  try {
    if (clearCookies) {
      await axios.post(`${API_URL}/auth/clear-session`, {}, { withCredentials: true, timeout: 3000 });
    }
  } catch {
    // Still leave the rejected session view if the local cleanup request fails.
  } finally {
    window.location.replace('/login');
  }
};

const processQueue = (error: unknown) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    const url = originalRequest.url || '';
    const isAuthEndpoint =
      url.includes('/auth/login') ||
      url.includes('/auth/refresh') ||
      url.includes('/auth/logout');

    // A second 401 after refresh means the session is unusable. Do not leave
    // the user on a protected page or repeatedly refresh the same request.
    if (error.response.status === 401 && !isAuthEndpoint && originalRequest._retry) {
      await redirectToLogin(true);
      return Promise.reject(error);
    }

    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosClient(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          },
        );

        processQueue(null);
        isRefreshing = false;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        isRefreshing = false;

        const sessionRejected =
          axios.isAxiosError(refreshError) &&
          (refreshError.response?.status === 401 ||
            refreshError.response?.status === 403);
        // Refresh BFF already clears both cookies when it rejects the session.
        if (sessionRejected) await redirectToLogin();

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
