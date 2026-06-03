import type { Order } from '@azani/shared';

const orders = new Map<string, Order>();

export function saveOrder(order: Order): void {
  orders.set(order.reference, order);
}

export function getOrderByReference(reference: string): Order | undefined {
  return orders.get(reference);
}

export function updateOrder(order: Order): void {
  orders.set(order.reference, order);
}
