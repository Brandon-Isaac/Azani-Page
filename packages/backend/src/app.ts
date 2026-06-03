import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { contactRouter } from './routes/contact.js';
import { healthRouter } from './routes/health.js';
import { ordersRouter } from './routes/orders.js';
import { paymentsRouter } from './routes/payments.js';
import { plansRouter } from './routes/plans.js';
import { reviewsRouter } from './routes/reviews.js';
import { webhooksRouter } from './routes/webhooks.js';

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
    })
  );

  app.use(express.json());

  app.use('/health', healthRouter);
  app.use('/plans', plansRouter);
  app.use('/orders', ordersRouter);
  app.use('/payments', paymentsRouter);
  app.use('/webhooks', webhooksRouter);
  app.use('/contact', contactRouter);
  app.use('/reviews', reviewsRouter);

  return app;
}
