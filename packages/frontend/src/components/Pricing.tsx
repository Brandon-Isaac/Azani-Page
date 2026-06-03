import { PLANS } from '@azani/shared';
import { useCheckout } from '../context/CheckoutContext';
import { PLAN_FEATURES } from '../data/planFeatures';

export function Pricing() {
  const { openCheckout } = useCheckout();

  return (
    <section id="pricing" className="pricing">
      <div className="pricing-container">
        <h2 className="section-title">Simple & Transparent Pricing</h2>
        <p className="section-subtitle">Choose the perfect plan for your needs</p>

        <div className="pricing-cards">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`pricing-card ${plan.featured ? 'featured' : ''} ${plan.bundle ? 'bundle' : ''}`}
            >
              {plan.badge && (
                <div
                  className={`plan-badge ${plan.featured ? 'featured-badge' : ''} ${plan.bundle ? 'bundle-badge' : ''}`}
                >
                  {plan.badge}
                </div>
              )}
              <h3 className="plan-name">{plan.name}</h3>
              <div className="plan-price">
                <span className="currency">KES</span>
                <span className="amount">{plan.priceKes}</span>
                {plan.savingLabel && <span className="saving">{plan.savingLabel}</span>}
              </div>
              <p className="plan-description">{plan.description}</p>
              <ul className="plan-features">
                {PLAN_FEATURES[plan.id]?.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <button
                type="button"
                className={`plan-button ${plan.featured ? 'featured-button' : ''} ${plan.bundle ? 'bundle-button' : ''}`}
                onClick={() => openCheckout(plan.id)}
              >
                Choose Plan
              </button>
            </div>
          ))}
        </div>

        <div className="pricing-footer">
          <p>
            💡 <strong>Pro Tip:</strong> Get the Complete Bundle and receive comprehensive documentation
            plus our database application—everything you need to succeed!
          </p>
        </div>
      </div>
    </section>
  );
}
