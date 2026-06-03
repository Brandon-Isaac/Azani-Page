import { Router } from 'express';
import { getOrderByReference, updateOrder } from '../services/orderStore.js';

export const webhooksRouter = Router();

webhooksRouter.post('/paystack', (req, res) => {
  const event = req.body as {
    event?: string;
    data?: { reference?: string; status?: string };
  };

  if (event.event === 'charge.success' && event.data?.reference) {
    const order = getOrderByReference(event.data.reference);
    if (order && order.status !== 'paid') {
      updateOrder({ ...order, status: 'paid' });
      console.log(`Webhook: order ${order.reference} marked paid`);
    }
  }

  res.sendStatus(200);
});
