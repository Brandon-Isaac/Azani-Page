import type { Order } from '@azani/shared';
import { useCallback } from 'react';
import { api } from '../api/client';
import type { PaystackSuccessResponse } from '../types/paystack';

interface PaystackPaymentParams {
  order: Order;
  paystackPublicKey: string;
  email: string;
  name: string;
  phone: string;
  onSuccess: (response: PaystackSuccessResponse) => void;
  onError: (message: string) => void;
  onClose?: () => void;
}

export function usePaystack() {
  const openPayment = useCallback(
    ({ order, paystackPublicKey, email, name, phone, onSuccess, onError, onClose }: PaystackPaymentParams) => {
      const key = paystackPublicKey || import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

      if (!key) {
        onError('Paystack public key is not configured');
        return;
      }

      if (!window.PaystackPop) {
        onError('Paystack script failed to load');
        return;
      }

      const handler = window.PaystackPop.setup({
        key,
        email,
        amount: order.amountKobo,
        currency: 'KES',
        ref: order.reference,
        metadata: {
          custom_fields: [
            { display_name: 'Full Name', variable_name: 'full_name', value: name },
            { display_name: 'Phone Number', variable_name: 'phone_number', value: phone },
            { display_name: 'Plan', variable_name: 'plan', value: order.planName },
            { display_name: 'Plan ID', variable_name: 'plan_id', value: order.planId },
          ],
        },
        onClose: () => {
          void api.verifyPayment({ reference: order.reference }).catch(console.error);
          onClose?.();
        },
        onSuccess: (response) => {
          onSuccess(response);
        },
      });

      handler.openIframe();
    },
    []
  );

  return { openPayment };
}
