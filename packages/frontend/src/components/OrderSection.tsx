import { PLANS } from '@azani/shared';
import { useCheckout } from '../context/CheckoutContext';
import { ORDER_DESCRIPTIONS } from '../data/planFeatures';

export function OrderSection() {
  const { openCheckout } = useCheckout();

  return (
    <section id="order" className="order-section">
      <div className="order-container">
        <h2 className="section-title">Ready to Get Started?</h2>
        <p className="section-subtitle">Choose your plan and complete payment securely</p>

        <div className="order-cards">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`order-card ${plan.featured ? 'featured-order' : ''}`}
            >
              {plan.badge && (
                <div className={`order-badge ${plan.bundle ? 'bundle-badge' : ''}`}>{plan.badge}</div>
              )}
              <h3>{plan.name}</h3>
              <div className="order-price">KES {plan.priceKes}</div>
              <p className="order-description">{ORDER_DESCRIPTIONS[plan.id]}</p>
              <button
                type="button"
                className="order-now-button"
                onClick={() => openCheckout(plan.id)}
              >
                Order Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
