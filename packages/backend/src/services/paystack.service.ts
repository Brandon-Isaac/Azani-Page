import { env } from '../config/env.js';

export interface PaystackVerifyData {
  status: boolean;
  message: string;
  data?: {
    status: string;
    reference: string;
    amount: number;
    currency: string;
    customer?: { email: string };
  };
}

export async function verifyTransaction(reference: string): Promise<PaystackVerifyData> {
  if (!env.PAYSTACK_SECRET_KEY) {
    throw new Error(
      'PAYSTACK_SECRET_KEY is not set. Add it to the root .env file to verify payments.'
    );
  }

  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: {
        Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Paystack verify failed: ${response.status}`);
  }

  return response.json() as Promise<PaystackVerifyData>;
}
