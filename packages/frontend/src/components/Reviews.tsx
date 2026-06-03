import { FormEvent, useState } from 'react';
import { api } from '../api/client';

const studentReviews = [
  {
    name: 'Sarah Kipchoge',
    role: 'KCSE Student, Nairobi County',
    text: 'Azani has been an absolute lifesaver! The documentation was so comprehensive and well-organized that it helped me understand complex concepts much better. While working on my project, I was also able to revise for my other exams effortlessly. The database application is incredibly intuitive and saved me hours of work. I genuinely believe this project helped improve my grades across the board. Highly recommend!',
  },
  {
    name: 'James Mutua',
    role: 'KCSE Student, Mombasa County',
    text: 'I was struggling with my project documentation when I discovered Azani. Not only did it solve my immediate problem, but the clarity and structure of the documentation became a reference guide while studying for my other exams. The developer really went above and beyond to ensure everything was perfect. It\'s rare to find someone so dedicated to their work. This experience has genuinely made me a better student. Thank you!',
  },
  {
    name: 'Emily Ochieng',
    role: 'KCSE Student, Kisumu County',
    text: 'Azani exceeded all my expectations! The project implementation was done with such precision and attention to detail that I could focus entirely on revising for my other exams without worrying about my coursework. The database application works flawlessly and the documentation is a masterpiece. This developer clearly puts their heart into their work. I\'ve recommended Azani to all my classmates. Truly exceptional service!',
  },
];

export function Reviews() {
  const [activeTab, setActiveTab] = useState<'student-reviews' | 'user-reviews'>('student-reviews');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem('reviewer-name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('reviewer-email') as HTMLInputElement).value;
    const role = (form.elements.namedItem('reviewer-role') as HTMLInputElement).value;
    const rating = (form.elements.namedItem('review-rating') as HTMLSelectElement).value;
    const reviewText = (form.elements.namedItem('review-text') as HTMLTextAreaElement).value;

    try {
      const result = await api.submitReview({ name, email, role, rating, reviewText });
      alert(result.message);
      form.reset();
      setActiveTab('student-reviews');
    } catch {
      alert('Please fill in all fields.');
    }
  };

  return (
    <section id="reviews" className="reviews">
      <div className="reviews-container">
        <h2 className="section-title">Student & User Reviews</h2>
        <p className="section-subtitle">See what students and users are saying about AZANI</p>

        <div className="reviews-tabs">
          <button
            type="button"
            className={`review-tab-button ${activeTab === 'student-reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('student-reviews')}
          >
            🎓 Student Reviews
          </button>
          <button
            type="button"
            className={`review-tab-button ${activeTab === 'user-reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('user-reviews')}
          >
            ✍️ Add Your Review
          </button>
        </div>

        <div
          id="student-reviews"
          className={`review-tab-content ${activeTab === 'student-reviews' ? 'active' : ''}`}
        >
          <div className="student-reviews-grid">
            {studentReviews.map((review) => (
              <div key={review.name} className="review-card student-review">
                <div className="review-header">
                  <div className="reviewer-info">
                    <h4 className="reviewer-name">{review.name}</h4>
                    <p className="reviewer-role">{review.role}</p>
                  </div>
                  <div className="review-rating">⭐⭐⭐⭐⭐</div>
                </div>
                <p className="review-text">{review.text}</p>
                <div className="review-meta">
                  <span className="review-date">May 2026</span>
                  <span className="review-verified">✓ Verified Purchase</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          id="user-reviews"
          className={`review-tab-content ${activeTab === 'user-reviews' ? 'active' : ''}`}
        >
          <div className="review-form-container">
            <h3>Share Your Experience with AZANI</h3>
            <p>Have you used Azani? We&apos;d love to hear your feedback!</p>

            <form className="review-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="reviewer-name">Your Name</label>
                  <input type="text" id="reviewer-name" name="reviewer-name" placeholder="Enter your name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="reviewer-email">Your Email</label>
                  <input type="email" id="reviewer-email" name="reviewer-email" placeholder="Enter your email" required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="reviewer-role">Your Role</label>
                  <input type="text" id="reviewer-role" name="reviewer-role" placeholder="e.g., Student, Developer, etc." required />
                </div>
                <div className="form-group">
                  <label htmlFor="review-rating">Rating</label>
                  <select id="review-rating" name="review-rating" required defaultValue="">
                    <option value="">Select a rating</option>
                    <option value="⭐">⭐ 1 Star</option>
                    <option value="⭐⭐">⭐⭐ 2 Stars</option>
                    <option value="⭐⭐⭐">⭐⭐⭐ 3 Stars</option>
                    <option value="⭐⭐⭐⭐">⭐⭐⭐⭐ 4 Stars</option>
                    <option value="⭐⭐⭐⭐⭐">⭐⭐⭐⭐⭐ 5 Stars</option>
                  </select>
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="review-text">Your Review</label>
                <textarea id="review-text" name="review-text" placeholder="Share your experience with Azani..." rows={6} required />
              </div>

              <div className="form-checkbox">
                <input type="checkbox" id="review-agree" required />
                <label htmlFor="review-agree">I agree to share my review publicly</label>
              </div>

              <button type="submit" className="review-submit-button">
                Submit Review
              </button>
            </form>

            <div className="form-note">
              <p>💡 Note: Reviews are moderated before appearing on our website. Thank you for your feedback!</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
