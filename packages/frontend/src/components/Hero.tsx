import { scrollToSection } from '../utils/scroll';

export function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          Welcome to <span className="highlight">AZANI</span>
        </h1>
        <p className="hero-subtitle">
          Professional Documentation & Database Solutions for Modern Development
        </p>
        <p className="hero-description">
          Transform your project management with comprehensive documentation and powerful database
          applications. Built for excellence, designed for scale.
        </p>
        <button
          type="button"
          className="cta-button"
          onClick={() => scrollToSection('order')}
        >
          Get Started Now
        </button>
      </div>
      <div className="hero-visual">
        <div className="hero-shape">
          <img src="/images/azani.png" alt="AZANI Visual Representation" />
        </div>
      </div>
    </section>
  );
}
