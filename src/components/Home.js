import React from 'react';
import './Home.css';

const Home = () => {
  return (
   
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Insurance Claim Processing System</h1>
          <p>Use the menu above to manage customers and claims.</p>
          <button className="cta-button">File a Claim</button>
        </div>
        <div className="hero-image">
          <div className="image-placeholder">
            <i className="fas fa-file-claim"></i>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stat-item">
          <div className="stat-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <h3>15,237</h3>
          <p>Claims Processed</p>
        </div>
        <div className="stat-item">
          <div className="stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <h3>8,492</h3>
          <p>Happy Customers</p>
        </div>
        <div className="stat-item">
          <div className="stat-icon">
            <i className="fas fa-clock"></i>
          </div>
          <h3>24-48 Hours</h3>
          <p>Average Processing Time</p>
        </div>
        <div className="stat-item">
          <div className="stat-icon">
            <i className="fas fa-dollar-sign"></i>
          </div>
          <h3>$42M</h3>
          <p>Claims Paid Out</p>
        </div>
      </section>

      {/* How It Works */}
      <section className="process-section">
        <h2>How Our Claim Process Works</h2>
        <div className="process-steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-icon">
              <i className="fas fa-clipboard-list"></i>
            </div>
            <h3>File Your Claim</h3>
            <p>Submit your claim through our secure online portal with all necessary documentation.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-icon">
              <i className="fas fa-search"></i>
            </div>
            <h3>Claim Review</h3>
            <p>Our experts carefully review your claim and may contact you for additional information.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-icon">
              <i className="fas fa-check-double"></i>
            </div>
            <h3>Approval Process</h3>
            <p>Once verified, your claim moves to the approval stage for final assessment.</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <div className="step-icon">
              <i className="fas fa-money-check-alt"></i>
            </div>
            <h3>Receive Payment</h3>
            <p>Approved claims are processed for payment, which you'll receive through your preferred method.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <h2>What Our Customers Say</h2>
        <div className="testimonials">
          <div className="testimonial">
            <div className="testimonial-content">
              <p>"The claim process was incredibly smooth. I received my payment within 48 hours of submitting all documents!"</p>
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">
                <i className="fas fa-user"></i>
              </div>
              <div className="author-details">
                <h4>Sarah Johnson</h4>
                <p>Auto Insurance Customer</p>
              </div>
            </div>
          </div>
          <div className="testimonial">
            <div className="testimonial-content">
              <p>"After my home was damaged in a storm, the team guided me through every step. Their support was exceptional."</p>
            </div>
            <div className="testimonial-author">
              <div className="author-avatar">
                <i className="fas fa-user"></i>
              </div>
              <div className="author-details">
                <h4>Michael Torres</h4>
                <p>Home Insurance Customer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <h2>Ready to File a Claim?</h2>
        <p>Our streamlined process makes it easy to get the compensation you deserve</p>
        <div className="cta-buttons">
          <button className="cta-primary">Start a Claim</button>
          <button className="cta-secondary">Contact Support</button>
        </div>
      </section>
    </div>
  );
};

export default Home;
