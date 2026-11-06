import 'server-only';

export const CORE_SERVICE_URL = (
  process.env.CORE_SERVICE_URL || 'http://localhost:8081'
).replace(/\/$/, '');
