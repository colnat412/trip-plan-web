import { DEFAULT_AUTH_REDIRECT_PATH } from '@/base/constants';

const notificationId = '[a-zA-Z0-9]{1,64}';
/** Only existing template links and the exact notification inbox route may survive login. */
export const getAuthReturnPath = (returnTo: string | null) => {
  if (returnTo && (/^\/templates\/[a-zA-Z0-9]+$/.test(returnTo) ||
      new RegExp(`^/overview\\?notificationId=${notificationId}$`).test(returnTo))) return returnTo;
  return DEFAULT_AUTH_REDIRECT_PATH;
};
