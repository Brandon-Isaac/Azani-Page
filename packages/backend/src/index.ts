import type { Server } from 'node:http';
import { createApp } from './app.js';
import { env } from './config/env.js';

const app = createApp();

const server: Server = app.listen(env.PORT, () => {
  console.log(`Azani API running at http://localhost:${env.PORT}`);
  if (!env.hasPaystackSecret) {
    console.warn(
      'Warning: PAYSTACK_SECRET_KEY is missing — payment verification will fail until you add it to .env'
    );
  }
});

server.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(
      `Port ${env.PORT} is already in use. Stop the other process on that port, then restart dev.`
    );
    process.exit(1);
  }
  throw err;
});

function shutdown(signal: string) {
  console.log(`${signal} received — closing HTTP server…`);
  server.close((closeErr) => {
    if (closeErr) {
      console.error('Error while closing server:', closeErr);
      process.exit(1);
    }
    process.exit(0);
  });
}

process.once('SIGINT', () => shutdown('SIGINT'));
process.once('SIGTERM', () => shutdown('SIGTERM'));
