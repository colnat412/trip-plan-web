import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { assertOnlyEnvFile } from './env-files.mjs';

const projectDirectory = fileURLToPath(new URL('../', import.meta.url));
const require = createRequire(import.meta.url);
const [command, ...args] = process.argv.slice(2);

try {
  if (!['dev', 'build', 'start'].includes(command)) {
    throw new Error('Dùng: node scripts/next.mjs dev|build|start [options]');
  }
  assertOnlyEnvFile(projectDirectory);

  const nextCli = require.resolve('next/dist/bin/next');
  const child = spawn(
    process.execPath,
    [nextCli, command, projectDirectory, ...args],
    {
      cwd: projectDirectory,
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_ENV: command === 'dev' ? 'development' : 'production',
      },
    },
  );

  const forwardInterrupt = () => child.kill('SIGINT');
  const forwardTerminate = () => child.kill('SIGTERM');
  process.on('SIGINT', forwardInterrupt);
  process.on('SIGTERM', forwardTerminate);
  child.on('error', () => {
    console.error(
      'Do not start Next.js. Check Node.js and dependencies are installed.',
    );
    process.exitCode = 1;
  });
  child.on('exit', (code, signal) => {
    process.off('SIGINT', forwardInterrupt);
    process.off('SIGTERM', forwardTerminate);
    process.exitCode = code ?? (signal === 'SIGINT' ? 130 : 143);
  });
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
