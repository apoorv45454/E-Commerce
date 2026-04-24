import { useContext, useEffect, useState } from "react";
import axios from "axios";
import heroImage from "../assets/hero.png";
import { CartContext } from "../context/cartContextInstance";
import { useFeedback } from "../context/useFeedback";

function Home() {
  const { addToCart, clearCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState({});
  const { showToast } = useFeedback();

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_URL + "/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, []);

  const increase = (id) => {
    setQuantity((prev) => ({
      ...prev,
      [id]: (prev[id] || 1) + 1
    }));
  };

  const decrease = (id) => {
    setQuantity((prev) => ({
      ...prev,
      [id]: prev[id] > 1 ? prev[id] - 1 : 1
    }));
  };

  const handleBuyNow = (product) => {
    clearCart();
    addToCart(product, quantity[product._id] || 1);
    showToast({
      title: "Checkout started",
      message: `${product.name} moved to checkout.`,
      tone: "success"
    });
    window.location.href = "/checkout";
  };

  const handleAddToCart = (product, qty) => {
    addToCart(product, qty);
    showToast({
      title: "Added to cart",
      message: `${qty} x ${product.name} is ready in your cart.`,
      tone: "success"
    });
  };

  const availableProducts = products.filter((product) => product.stock > 0).length;
  const totalStock = products.reduce((sum, product) => sum + Number(product.stock || 0), 0);

  return (
    <main className="page">
      <div className="page-container fade-in">
        <section className="page-header">
          <div className="page-header-grid" style={{ gridTemplateColumns: "minmax(0, 1.3fr) minmax(260px, 0.9fr)" }}>
            <div className="hero-copy">
              <span className="page-eyebrow">Customer Fulfillment Hub</span>
              <h1 className="page-title">Shop by product, but think in delivery confidence.</h1>
              <p className="page-subtitle">
                Every card is designed to make stock, savings, and purchase action instantly
                scannable so customers can move from discovery to confirmed order without friction.
              </p>
            </div>

            <div className="hero-panel" style={{ padding: "1.2rem" }}>
              <div className="product-media" style={{ marginBottom: "0.8rem", height: "160px" }}>
                <img src={heroImage} alt="ShopKart logistics theme" />
              </div>
              <div className="mini-stat-grid">
                <div className="metric-item">
                  <strong>{products.length}</strong>
                  <span>catalog products</span>
                </div>
                <div className="metric-item">
                  <strong>{availableProducts}</strong>
                  <span>ready to ship</span>
                </div>
                <div className="metric-item">
                  <strong>{totalStock}</strong>
                  <span>units in network</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="split-header">
            <div>
              <h2 className="section-title">Operationally clear product catalog</h2>
              <p className="section-copy">
                Rich product cards, quick quantity control, and direct buy actions stay tied to the existing cart flow.
              </p>
            </div>
          </div>

          <div className="product-grid" style={{ marginTop: "1.2rem" }}>
            {products.map((product) => {
              const hasDiscount = Number(product.originalPrice) > Number(product.price);
              const discount = hasDiscount
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;
              const qty = quantity[product._id] || 1;

              return (
                <article key={product._id} className="product-card">
                  <div className="product-topline">
                    <span className={`badge ${product.stock > 0 ? "success" : "danger"}`}>
                      {product.stock > 0 ? "Ready to ship" : "Unavailable"}
                    </span>
                    {discount > 0 && <span className="badge warn">{discount}% off</span>}
                  </div>

                  <div className="product-media">
                    <img src={product.image} alt={product.name} />
                  </div>

                  <h2 className="panel-title">{product.name}</h2>
                  <p className="muted">{product.description}</p>

                  <div className="price-row">
                    <span className="price-main">Rs {product.price}</span>
                    {hasDiscount && (
                      <span className="price-strike">Rs {product.originalPrice}</span>
                    )}
                  </div>

                  <div className="info-row" style={{ margin: "0.4rem 0 1rem" }}>
                    <span className={`badge ${product.stock > 4 ? "" : "warn"}`}>
                      {product.stock > 0 ? `${product.stock} units left` : "No stock"}
                    </span>
                    
                  </div>

                  <div className="qty-row">
                    <div className="qty-box">
                      <button className="qty-button" onClick={() => decrease(product._id)}>
                        -
                      </button>
                      <span className="qty-value">{qty}</span>
                      <button className="qty-button" onClick={() => increase(product._id)}>
                        +
                      </button>
                    </div>
                  </div>

                  <div className="button-row" style={{ marginTop: "1rem" }}>
                    <button
                      disabled={product.stock === 0}
                      onClick={() => handleAddToCart(product, qty)}
                      className="primary-button"
                      style={{ opacity: product.stock === 0 ? 0.55 : 1 }}
                    >
                      Add to Cart
                    </button>
                    <button
                      disabled={product.stock === 0}
                      onClick={() => handleBuyNow(product)}
                      className="ghost-button"
                      style={{ opacity: product.stock === 0 ? 0.55 : 1 }}
                    >
                      Buy Now
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}

export default Home;
