import type { VerifyPaymentRequest, VerifyPaymentResponse } from '@azani/shared';
import { Router } from 'express';
import { getOrderByReference, updateOrder } from '../services/orderStore.js';
import { verifyTransaction } from '../services/paystack.service.js';

export const paymentsRouter = Router();

paymentsRouter.post('/verify', async (req, res) => {
  const { reference } = req.body as VerifyPaymentRequest;

  if (!reference) {
    res.status(400).json({ success: false, message: 'reference is required' });
    return;
  }

  const order = getOrderByReference(reference);
  if (!order) {
    res.status(404).json({ success: false, message: 'Order not found' });
    return;
  }

  try {
    const result = await verifyTransaction(reference);

    if (result.status && result.data?.status === 'success') {
      const paidOrder = { ...order, status: 'paid' as const };
      updateOrder(paidOrder);

      const response: VerifyPaymentResponse = {
        success: true,
        order: paidOrder,
        message: 'Payment verified successfully',
      };
      res.json(response);
      return;
    }

    const response: VerifyPaymentResponse = {
      success: false,
      order,
      message: result.message || 'Payment not completed',
    };
    res.json(response);
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment with Paystack',
    });
  }
});
