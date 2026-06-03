import { config } from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '../../../..');

config({ path: resolve(repoRoot, '.env') });
config({ path: resolve(process.cwd(), '.env') });

function normalizeEnv(input: NodeJS.ProcessEnv) {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined) {
      out[key.trim()] = value.trim();
    }
  }
  return out;
}

const envSchema = z.object({
  PORT: z.coerce.number().default(3001),
  PAYSTACK_SECRET_KEY: z.string().min(1).optional(),
  PAYSTACK_PUBLIC_KEY: z.string().min(1, 'PAYSTACK_PUBLIC_KEY is required'),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
});

const parsed = envSchema.parse(normalizeEnv(process.env));

/** Browsers send Origin without a trailing slash; CORS must match exactly. */
function stripTrailingSlash(url: string): string {
  return url.replace(/\/+$/, '');
}

export const env = {
  ...parsed,
  FRONTEND_URL: stripTrailingSlash(parsed.FRONTEND_URL),
  hasPaystackSecret: Boolean(parsed.PAYSTACK_SECRET_KEY),
};
