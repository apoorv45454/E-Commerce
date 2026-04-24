import { useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/cartContextInstance";
import { useFeedback } from "../context/useFeedback";

function Cart() {
  const { cart, increaseQty, decreaseQty, removeItem } = useContext(CartContext);
  const { showDialog, showToast } = useFeedback();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    try {
      const { data } = await axios.post(import.meta.env.VITE_API_URL + "/payment/create-order", {
        amount: total
      });

      const options = {
        key: "rzp_test_Sg1vx8I440GPIq",
        amount: data.amount,
        currency: "INR",
        name: "ShopKart",
        description: "Order Payment",
        order_id: data.id,
        handler: async function (response) {
          try {
            await axios.post(import.meta.env.VITE_API_URL + "/orders/create", {
              userId: user._id,
              products: cart.map((item) => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price
              })),
              totalAmount: total,
              paymentId: response.razorpay_payment_id,
              status: "Paid"
            });

            showDialog({
              title: "Order placed successfully",
              message: "Your payment is confirmed and the order is now available in tracking.",
              tone: "success",
              confirmLabel: "View Tracking",
              onConfirm: () => {
                window.location.href = "/track";
              }
            });
          } catch (err) {
            console.log(err);
            showToast({
              title: "Order could not be saved",
              message: "Payment succeeded but saving the order failed. Please retry or contact support.",
              tone: "error"
            });
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.log(err);
      showToast({
        title: "Payment failed",
        message: "The payment window could not be completed.",
        tone: "error"
      });
    }
  };

  if (cart.length === 0) {
    return (
      <main className="page">
        <div className="page-container fade-in">
          <section className="empty-state">
            <h1 className="section-title">Your cart is ready for its next product.</h1>
            <p className="section-copy">
              Nothing is staged for checkout yet. Head back to the catalog and add items to begin the fulfillment flow.
            </p>
            <div className="button-row" style={{ justifyContent: "center", marginTop: "1rem" }}>
              <Link to="/home" className="primary-button">
                Browse Products
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="page-container fade-in">
        <section className="page-header">
          <span className="page-eyebrow">Staging Area</span>
          <h1 className="page-title">Review items before dispatch and payment.</h1>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Items queued</div>
              <div className="stat-value">{totalItems}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Cart value</div>
              <div className="stat-value">Rs {total}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Next step</div>
              <div className="stat-value">Address + payment</div>
            </div>
          </div>
        </section>

        <section className="section cart-layout" style={{ display: "grid", gap: "1.5rem", marginTop: "1.5rem" }}>
          <div className="surface-card">
            <div className="split-header" style={{ marginBottom: "1rem" }}>
              <div>
                <h2 className="section-title">Cart manifest</h2>
                <p className="section-copy">Quantities and totals stay synced with the existing cart context.</p>
              </div>
            </div>

            <div className="order-card-list">
              {cart.map((item) => (
                <article key={item._id} className="cart-item">
                  <img
                    src={item.image || "https://via.placeholder.com/150"}
                    alt={item.name}
                    className="cart-thumb"
                  />

                  <div>
                    <h3 className="panel-title">{item.name}</h3>
                    <p className="muted">
                      Rs {item.price} x {item.quantity}
                    </p>
                    <p className="price-main" style={{ fontSize: "1.15rem" }}>
                      Rs {item.price * item.quantity}
                    </p>
                  </div>

                  <div className="inline-actions" style={{ justifyContent: "end" }}>
                    <div className="qty-box">
                      <button className="qty-button" onClick={() => decreaseQty(item._id)}>
                        -
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button className="qty-button" onClick={() => increaseQty(item._id)}>
                        +
                      </button>
                    </div>
                    <button className="danger-button" onClick={() => removeItem(item._id)}>
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="summary-card">
            <h2 className="section-title">Checkout snapshot</h2>
            <div className="summary-row">
              <span>Total line items</span>
              <strong>{cart.length}</strong>
            </div>
            <div className="summary-row">
              <span>Total units</span>
              <strong>{totalItems}</strong>
            </div>
            <div className="summary-row">
              <span>Payable now</span>
              <strong className="price-main" style={{ fontSize: "1.4rem" }}>Rs {total}</strong>
            </div>
            <div className="button-row" style={{ marginTop: "1rem" }}>
              <button onClick={() => (window.location.href = "/checkout")} className="primary-button">
                Proceed to Checkout
              </button>
              <button onClick={handleCheckout} className="ghost-button">
                Quick Pay
              </button>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

export default Cart;
