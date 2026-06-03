const features = [
  {
    icon: '📋',
    title: 'Comprehensive Documentation',
    text: 'Professional, well-structured documentation that makes your project accessible to all stakeholders and future developers.',
  },
  {
    icon: '🗄️',
    title: 'Database Application',
    text: 'Robust database solutions designed for reliability, scalability, and performance with enterprise-grade features.',
  },
  {
    icon: '⚡',
    title: 'Lightning Fast',
    text: 'Optimized performance ensuring your project runs smoothly with minimal latency and maximum efficiency.',
  },
  {
    icon: '🔒',
    title: 'Secure & Reliable',
    text: 'Enterprise-grade security protocols and data protection to keep your information safe and compliant.',
  },
];

export function About() {
  return (
    <section id="about" className="about">
      <div className="about-container">
        <h2 className="section-title">AZANI?</h2>
        <p className="section-subtitle">
          A comprehensive solution for your documentation and database needs
        </p>
        <div className="features-grid">
          {features.map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
