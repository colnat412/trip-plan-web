import type { NextConfig } from 'next';
import { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD } from 'next/constants';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {};

const withNextIntl = createNextIntlPlugin();

export default async function config(phase: string) {
  if (phase === PHASE_DEVELOPMENT_SERVER || phase === PHASE_PRODUCTION_BUILD) {
    // Next.js has loaded the local or hosting environment before this config runs.
    // Generate the standalone FCM worker alongside the public assets at build time.
    const { build } = await import('esbuild');
    const publicVariables = [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
      'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
      'NEXT_PUBLIC_FIREBASE_APP_ID',
      'NEXT_PUBLIC_FIREBASE_VAPID_KEY',
      'NEXT_PUBLIC_NOTIFICATIONS_ENABLED',
    ];
    const define = Object.fromEntries(publicVariables.map(name => [
      `process.env.${name}`,
      JSON.stringify(process.env[name] ?? (name === 'NEXT_PUBLIC_NOTIFICATIONS_ENABLED' ? 'false' : '')),
    ]));
    await build({
      entryPoints: ['src/features/notification/worker/firebase-messaging-sw.ts'],
      outfile: 'public/firebase-messaging-sw.js',
      bundle: true,
      minify: true,
      format: 'iife',
      platform: 'browser',
      target: 'es2020',
      define,
    });
  }

  return withNextIntl(nextConfig);
}
