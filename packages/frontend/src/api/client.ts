import type {
  CreateOrderRequest,
  CreateOrderResponse,
  VerifyPaymentRequest,
  VerifyPaymentResponse,
} from '@azani/shared';
import type { Plan } from '@azani/shared';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error((data as { message?: string }).message || `Request failed: ${response.status}`);
  }

  return data as T;
}

export const api = {
  getPlans: () => request<{ plans: Plan[] }>('/plans'),
  createOrder: (body: CreateOrderRequest) =>
    request<CreateOrderResponse>('/orders', { method: 'POST', body: JSON.stringify(body) }),
  verifyPayment: (body: VerifyPaymentRequest) =>
    request<VerifyPaymentResponse>('/payments/verify', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  submitContact: (body: { name: string; email: string; message: string }) =>
    request<{ success: boolean; message: string }>('/contact', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  submitReview: (body: {
    name: string;
    email: string;
    role: string;
    rating: string;
    reviewText: string;
  }) =>
    request<{ success: boolean; message: string }>('/reviews', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};
