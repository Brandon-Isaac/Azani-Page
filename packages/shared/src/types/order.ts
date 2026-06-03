export type OrderStatus = 'pending' | 'paid' | 'failed';

export interface Plan {
  id: string;
  name: string;
  priceKes: number;
  description: string;
  badge?: string;
  featured?: boolean;
  bundle?: boolean;
  savingLabel?: string;
}

export interface CreateOrderRequest {
  planId: string;
  email: string;
  name: string;
  phone: string;
}

export interface Order {
  id: string;
  reference: string;
  planId: string;
  planName: string;
  amountKobo: number;
  email: string;
  name: string;
  phone: string;
  status: OrderStatus;
  createdAt: string;
}

export interface CreateOrderResponse {
  order: Order;
  paystackPublicKey: string;
}

export interface VerifyPaymentRequest {
  reference: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  order?: Order;
  message?: string;
}
