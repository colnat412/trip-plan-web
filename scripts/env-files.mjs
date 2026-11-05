import { readdirSync, statSync } from 'node:fs';
import path from 'node:path';

export function assertOnlyEnvFile(projectDirectory) {
  const extraEnvFiles = readdirSync(projectDirectory).filter(
    (name) => name.startsWith('.env.') && name !== '.env.example',
  );
  if (extraEnvFiles.length > 0) {
    throw new Error(
      `Only .env file is allowed. Please move necessary configurations to .env and remove these files from the project: ${extraEnvFiles.join(', ')}`,
    );
  }

  const envPath = path.join(projectDirectory, '.env');
  let hasEnvFile = false;
  try {
    hasEnvFile = statSync(envPath).isFile();
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  if (!hasEnvFile) {
    throw new Error(
      'Missing .env file in the project root. Please create a configuration file before running dev/build/start.',
    );
  }
}
