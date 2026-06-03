/**
 * Shared build + concurrently dev, with NODE_OPTIONS=--trace-warnings so
 * MaxListenersExceededWarning prints a stack trace on the process that triggered it.
 */
import { spawnSync, spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const build = spawnSync('npm', ['run', 'build', '-w', '@azani/shared'], {
  cwd: repoRoot,
  stdio: 'inherit',
  shell: true,
});

if (build.status !== 0) {
  process.exit(build.status ?? 1);
}

const nodeOptions = [process.env.NODE_OPTIONS, '--trace-warnings']
  .filter(Boolean)
  .join(' ');

const concurrentlyBin = path.join(
  repoRoot,
  'node_modules',
  'concurrently',
  'dist',
  'bin',
  'concurrently.js'
);

const child = spawn(
  process.execPath,
  [
    concurrentlyBin,
    '-n',
    'backend,frontend',
    '-c',
    'blue,green',
    'npm run dev -w @azani/backend',
    'npm run dev -w @azani/frontend',
  ],
  {
    cwd: repoRoot,
    env: { ...process.env, NODE_OPTIONS: nodeOptions },
    stdio: 'inherit',
  }
);

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});
