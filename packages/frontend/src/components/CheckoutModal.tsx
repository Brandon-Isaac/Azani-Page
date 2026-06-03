import { FormEvent, useEffect, useState } from 'react';
import { api } from '../api/client';
import { useCheckout } from '../context/CheckoutContext';
import { usePaystack } from '../hooks/usePaystack';
import type { PaystackSuccessResponse } from '../types/paystack';

export function CheckoutModal() {
  const { selectedPlan, isOpen, closeCheckout } = useCheckout();
  const { openPayment } = usePaystack();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) closeCheckout();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, closeCheckout]);

  useEffect(() => {
    if (isOpen) {
      setError('');
      setSuccess('');
    }
  }, [isOpen, selectedPlan]);

  if (!isOpen || !selectedPlan) return null;

  const validate = (email: string, name: string, phone: string) => {
    if (!email || !name || !phone) {
      setError('❌ Please fill in all fields');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('❌ Please enter a valid email address');
      return false;
    }
    if (!/^[\d+\-\s()]+$/.test(phone) || phone.replace(/\D/g, '').length < 9) {
      setError('❌ Please enter a valid phone number');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim();
    const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim();
    const phone = (form.elements.namedItem('phone') as HTMLInputElement).value.trim();

    if (!validate(email, name, phone)) return;

    setLoading(true);
    try {
      const { order, paystackPublicKey } = await api.createOrder({
        planId: selectedPlan.id,
        email,
        name,
        phone,
      });

      openPayment({
        order,
        paystackPublicKey,
        email,
        name,
        phone,
        onSuccess: async (response: PaystackSuccessResponse) => {
          try {
            const verified = await api.verifyPayment({ reference: response.reference });
            if (verified.success && verified.order) {
              setSuccess(
                `✅ Payment successful! Transaction Reference: ${response.reference}\n\n` +
                  `An email confirmation will be sent to ${email}.\n` +
                  `You will receive access to your ${selectedPlan.name} shortly.`
              );
              setTimeout(() => {
                closeCheckout();
                alert(
                  `Thank you for your purchase, ${name}!\n\n` +
                    `You will receive your ${selectedPlan.name} access details via email at ${email}.\n\n` +
                    `Order Reference: ${response.reference}`
                );
              }, 2500);
            } else {
              setError('❌ Payment could not be verified. Please contact support.');
            }
          } catch {
            setError('❌ Payment verification failed. Please contact support with your reference.');
          } finally {
            setLoading(false);
          }
        },
        onError: (message) => {
          setError(`❌ ${message}`);
          setLoading(false);
        },
        onClose: () => setLoading(false),
      });
    } catch (err) {
      setError(err instanceof Error ? `❌ ${err.message}` : '❌ An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div
      id="checkoutModal"
      className={`checkout-modal-overlay ${isOpen ? 'active' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeCheckout();
      }}
      role="presentation"
    >
      <div className="checkout-modal">
        <div className="checkout-modal-header">
          <h2>Checkout</h2>
          <button type="button" className="checkout-close-btn" onClick={closeCheckout} aria-label="Close modal">
            &times;
          </button>
        </div>

        <div className="checkout-modal-body">
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-item">
              <span className="summary-label">Plan:</span>
              <span className="summary-value">{selectedPlan.name}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Price:</span>
              <span className="summary-value">KES {selectedPlan.priceKes}</span>
            </div>
            <div className="summary-divider" />
            <div className="summary-item total">
              <span className="summary-label">Total:</span>
              <span className="summary-value">KES {selectedPlan.priceKes}</span>
            </div>
          </div>

          <form id="checkoutForm" className="checkout-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="customerEmail">Email Address</label>
              <input
                type="email"
                id="customerEmail"
                name="email"
                placeholder="your@email.com"
                required
                style={{ color: '#1f2937', backgroundColor: '#ffffff' }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="customerName">Full Name</label>
              <input
                type="text"
                id="customerName"
                name="name"
                placeholder="Your Full Name"
                required
                style={{ color: '#1f2937', backgroundColor: '#ffffff' }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="customerPhone">Phone Number</label>
              <input
                type="tel"
                id="customerPhone"
                name="phone"
                placeholder="254712345678"
                required
                style={{ color: '#1f2937', backgroundColor: '#ffffff' }}
              />
            </div>

            {error && (
              <div id="checkoutError" className="checkout-error" style={{ display: 'block' }}>
                {error}
              </div>
            )}
            {success && (
              <div id="checkoutSuccess" className="checkout-success" style={{ display: 'block' }}>
                {success}
              </div>
            )}

            <button type="submit" id="paymentButton" className="checkout-button" disabled={loading}>
              <span id="buttonText">{loading ? 'Processing... ⏳' : 'Pay with Paystack'}</span>
            </button>

            <p className="payment-info">
              💳 Powered by <strong>Paystack</strong> | Secure payment processing
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
