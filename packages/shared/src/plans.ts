import type { Plan } from './types/order.js';

export const PLANS: Plan[] = [
  {
    id: 'doc-package',
    name: 'Documentation Package',
    priceKes: 500,
    description: 'Perfect for getting started with professional documentation',
    badge: 'MILESTONE 1',
  },
  {
    id: 'db-app',
    name: 'Database Application',
    priceKes: 1000,
    description: 'Complete database solution with advanced features',
    badge: 'MOST POPULAR',
    featured: true,
  },
  {
    id: 'complete-bundle',
    name: 'Complete Bundle',
    priceKes: 1350,
    description: 'Everything you need in one powerful package',
    badge: 'BEST VALUE',
    bundle: true,
    savingLabel: 'Save KES 150',
  },
];

export function getPlanById(planId: string): Plan | undefined {
  return PLANS.find((p) => p.id === planId);
}

export function kesToKobo(kes: number): number {
  return kes * 100;
}
