import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const showcase = [
  {
    title: "Order command center",
    copy: "Monitor orders from placement to doorstep with a single, clear operational view."
  },
  {
    title: "Smart fulfillment flow",
    copy: "Surface packed, shipped, delayed, and ready-to-dispatch states without clutter."
  },
  {
    title: "Customer-first tracking",
    copy: "Turn raw order data into a premium, transparent delivery experience."
  }
];

function Landing() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % showcase.length);
    }, 2800);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="landing-shell">
      <div className="page-container landing-grid fade-in">
        <section className="hero-panel">
          <div className="hero-copy">
            <span className="page-eyebrow">Fulfillment Experience Platform</span>
            <div className="brand-lockup">
              <img src="/logo-mark.svg" alt="ShopKart logo" className="brand-logo" />
              <div className="brand-copy">
                <strong>ShopKart</strong>
                <span>Order tracking and fulfillment storefront</span>
              </div>
            </div>
            <h1 className="hero-title">Commerce that feels like a live delivery network.</h1>
            <p>
              ShopKart now reads like a modern operations hub: premium product discovery,
              confidence-building checkout, and order tracking that feels precise from
              warehouse scan to last-mile drop.
            </p>

            <div className="button-row">
              <Link to="/login" className="primary-button">
                Get Started
              </Link>
              <Link to="/register" className="secondary-button">
                Create Account
              </Link>
            </div>

            <div className="kpi-strip">
              <div className="kpi-card">
                <strong>24/7</strong>
                <span>shipment visibility</span>
              </div>
              <div className="kpi-card">
                <strong>6-step</strong>
                <span>tracking timeline</span>
              </div>
              <div className="kpi-card">
                <strong>1-click</strong>
                <span>cart to checkout flow</span>
              </div>
            </div>
          </div>
        </section>

        <section className="hero-panel">
          <div className="hero-visual">
            <div className="stack-orb" />
            <div className="floating-card top">
              <small>Dispatch pulse</small>
              <strong>128 live updates</strong>
            </div>
            <div className="floating-card bottom">
              <small>On-time promise</small>
              <strong>98.4% network health</strong>
            </div>
          </div>

          <div className="carousel-strip">
            {showcase.map((item, index) => (
              <div key={item.title} className={`carousel-card ${index === activeSlide ? "active" : ""}`}>
                <strong>{item.title}</strong>
                <p>{item.copy}</p>
              </div>
            ))}
          </div>

          <div className="dot-row">
            {showcase.map((item, index) => (
              <span key={item.title} className={`dot ${index === activeSlide ? "active" : ""}`} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Landing;
