import { PLANS, type Plan } from '@azani/shared';
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

interface CheckoutContextValue {
  selectedPlan: Plan | null;
  isOpen: boolean;
  openCheckout: (planId: string) => void;
  closeCheckout: () => void;
}

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openCheckout = useCallback((planId: string) => {
    const plan = PLANS.find((p) => p.id === planId);
    if (!plan) return;
    setSelectedPlan(plan);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeCheckout = useCallback(() => {
    setIsOpen(false);
    setSelectedPlan(null);
    document.body.style.overflow = 'auto';
  }, []);

  const value = useMemo(
    () => ({ selectedPlan, isOpen, openCheckout, closeCheckout }),
    [selectedPlan, isOpen, openCheckout, closeCheckout]
  );

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error('useCheckout must be used within CheckoutProvider');
  return ctx;
}
