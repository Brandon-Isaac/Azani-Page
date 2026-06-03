import { getPlanById, kesToKobo } from '@azani/shared';
import type { CreateOrderRequest, CreateOrderResponse, Order } from '@azani/shared';
import { Router } from 'express';
import { env } from '../config/env.js';
import { saveOrder } from '../services/orderStore.js';

export const ordersRouter = Router();

function createReference(): string {
  return `AZANI-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

ordersRouter.post('/', (req, res) => {
  const body = req.body as CreateOrderRequest;
  const { planId, email, name, phone } = body;

  if (!planId || !email || !name || !phone) {
    res.status(400).json({ message: 'planId, email, name, and phone are required' });
    return;
  }

  const plan = getPlanById(planId);
  if (!plan) {
    res.status(400).json({ message: 'Invalid planId' });
    return;
  }

  const reference = createReference();
  const order: Order = {
    id: reference,
    reference,
    planId: plan.id,
    planName: plan.name,
    amountKobo: kesToKobo(plan.priceKes),
    email,
    name,
    phone,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  saveOrder(order);

  const response: CreateOrderResponse = {
    order,
    paystackPublicKey: env.PAYSTACK_PUBLIC_KEY,
  };

  res.status(201).json(response);
});
