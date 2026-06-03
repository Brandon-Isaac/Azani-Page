import { PLANS } from '@azani/shared';
import { Router } from 'express';

export const plansRouter = Router();

plansRouter.get('/', (_req, res) => {
  res.json({ plans: PLANS });
});
