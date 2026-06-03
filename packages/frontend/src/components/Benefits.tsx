const benefits = [
  { title: '✨ Quality Assured', text: 'Professional grade solutions backed by expertise and proven methodologies' },
  { title: '🚀 Future Ready', text: "Built with scalability in mind for your project's growth" },
  { title: '💼 Professional Support', text: 'Dedicated support to ensure your success' },
  { title: '📈 Proven Results', text: 'Trusted by multiple projects for their documentation and database needs' },
];

export function Benefits() {
  return (
    <section className="benefits">
      <div className="benefits-container">
        <h2 className="section-title">Why Choose AZANI?</h2>
        <div className="benefits-grid">
          {benefits.map((b) => (
            <div key={b.title} className="benefit-item">
              <h4>{b.title}</h4>
              <p>{b.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
