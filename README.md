# Azani — KCSE Project Solutions

Monorepo with a TypeScript **React** frontend and **Express** API, plus shared plan/order types.

## Structure

```
packages/
  shared/     # Plans, order types (used by frontend & backend)
  backend/    # REST API, Paystack verify, webhooks
  frontend/   # Vite + React landing page & checkout
```

## Setup

1. Copy environment variables:

   ```bash
   cp .env.example .env
   cp packages/frontend/.env.example packages/frontend/.env
   ```

   Set `PAYSTACK_SECRET_KEY` and `PAYSTACK_PUBLIC_KEY` in the root `.env` (from [Paystack Dashboard](https://dashboard.paystack.com/)).  
   Set `VITE_PAYSTACK_PUBLIC_KEY` in `packages/frontend/.env` to the same **public** key.

2. Install dependencies (from repo root):

   ```bash
   npm install
   npm run build -w @azani/shared
   ```

3. Run frontend and backend together:

   ```bash
   npm run dev
   ```

   - Frontend: http://localhost:5173  
   - API: http://localhost:3001  
   - API requests from the UI are proxied via `/api` → backend.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Shared build + backend + frontend |
| `npm run dev:trace` | Same as `dev`, but prints stack traces for Node warnings |
| `npm run dev:backend` | API only |
| `npm run dev:frontend` | UI only |
| `npm run build` | Build all packages |

## API endpoints

- `GET /health` — health check  
- `GET /plans` — list plans  
- `POST /orders` — create pending order (returns Paystack reference)  
- `POST /payments/verify` — verify transaction with Paystack  
- `POST /webhooks/paystack` — Paystack webhook (optional)  
- `POST /contact` — contact form  
- `POST /reviews` — review submission  

## Troubleshooting: `MaxListenersExceededWarning` (11 close listeners)

This warning means **more than 10 handlers** were attached to the **`close`** event on one object (often a socket or stream). It is common in **local dev** and is not always a bug in your app code.

1. **See who registered the listener** — from the repo root:
   ```bash
   npm run dev:trace
   ```
   When the warning appears, Node prints a stack trace (look for `[TLSSocket]`, `concurrently`, `tsx`, `vite`, etc.).

2. **Port already in use** — if the backend crashes with `EADDRINUSE` on port 3001, an old API process is still running. Stop other `npm run dev` terminals or kill the process on that port, then start again. The API now closes its HTTP server on `SIGINT` / `SIGTERM` so `tsx watch` restarts are less likely to leave a stray listener.

3. **Harmless dev tooling** — `concurrently`, `tsx watch`, and Vite’s proxy can add shutdown listeners. If memory stays flat and you only see this once at startup, you can ignore it.

4. **Node / network** — on some Node 20+ versions, many quick connections (npm, proxies, Paystack) can trigger `close` listener warnings on `TLSSocket`. Updating Node or using `NODE_OPTIONS=--no-network-family-autoselection` can help if traces point at `internalConnectMultiple`.

## Paystack webhook (production)

Set webhook URL to: `https://your-api-domain/webhooks/paystack`

## Legacy static site

The original root `index.html`, `checkout.js`, and `style.css` have been replaced by this monorepo. Assets live in `packages/frontend/public/images/`.
