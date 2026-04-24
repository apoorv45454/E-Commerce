import { useEffect, useState } from "react";
import axios from "axios";
import { useFeedback } from "../context/useFeedback";

const steps = ["Placed", "Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered"];

function TrackOrder() {
  const [orders, setOrders] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const { confirmAction, showDialog, showToast } = useFeedback();

  useEffect(() => {
    if (!user?._id) return;

    axios
      .get(`${import.meta.env.VITE_API_URL}/orders?userId=${user._id}`)
      .then((res) => setOrders(res.data || []))
      .catch((err) => console.log(err));
  }, [user?._id]);

  const getStepIndex = (status) => {
    if (!status) return -1;
    return steps.findIndex((step) => step.toLowerCase() === status.toLowerCase());
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handleCancel = async (id) => {
    const confirmed = await confirmAction({
      title: "Cancel this order?",
      message: "This will stop the fulfillment flow and restore the reserved stock.",
      tone: "warning",
      confirmLabel: "Cancel Order"
    });

    if (!confirmed) return;

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/orders/cancel/${id}`);

      setOrders((prev) => prev.map((order) => (order._id === id ? { ...order, status: "Cancelled" } : order)));
      showDialog({
        title: "Order cancelled",
        message: "The order has been cancelled and removed from the active fulfillment lane.",
        tone: "success",
        confirmLabel: "Continue"
      });
    } catch (err) {
      showToast({
        title: "Cancellation unavailable",
        message: err?.response?.data?.msg || "This order can no longer be cancelled.",
        tone: "error"
      });
    }
  };

  const activeOrders = orders.filter((order) => order.status !== "Delivered").length;

  return (
    <main className="page">
      <div className="page-container fade-in">
        <section className="page-header">
          <span className="page-eyebrow">Order Tracking Workspace</span>
          <h1 className="page-title">Follow each order through the fulfillment timeline.</h1>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Total orders</div>
              <div className="stat-value">{orders.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Active deliveries</div>
              <div className="stat-value">{activeOrders}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Timeline</div>
              <div className="stat-value">6 checkpoints</div>
            </div>
          </div>
        </section>

        <section className="section">
          {orders.length === 0 ? (
            <div className="empty-state">
              <h2 className="section-title">No orders found.</h2>
              <p className="section-copy">Once you place an order, its live timeline will appear here.</p>
            </div>
          ) : (
            <div className="order-card-list">
              {orders.map((order) => {
                const status = order?.status || "";
                const currentStep = getStepIndex(status);
                const isCancelled = status.toLowerCase() === "cancelled";

                return (
                  <article key={order._id} className="track-card">
                    <div className="track-meta">
                      <div>
                        <div className="page-eyebrow" style={{ color: "#102133", background: "rgba(16, 33, 51, 0.06)" }}>
                          Order {order._id.slice(-8)}
                        </div>
                        <p className="muted" style={{ marginTop: "0.6rem" }}>
                          Placed on {formatDate(order.createdAt)}
                        </p>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <strong className="price-main" style={{ display: "block" }}>Rs {order.totalAmount}</strong>
                        <span
                          className={`status-badge ${
                            isCancelled
                              ? "cancelled"
                              : order.paymentMethod === "Online"
                              ? "online"
                              : "cod"
                          }`}
                        >
                          {isCancelled
                            ? "Cancelled"
                            : order.paymentMethod === "Online"
                            ? "Paid Online"
                            : "Cash on Delivery"}
                        </span>
                      </div>
                    </div>

                    {order.address && (
                      <div className="surface-card" style={{ padding: "1rem" }}>
                        <div className="address-head">
                          <h3 className="panel-title" style={{ marginBottom: 0 }}>Delivery address</h3>
                          <span className="badge">Verified</span>
                        </div>
                        <p className="muted">
                          {order.address.name} {order.address.phone ? `| ${order.address.phone}` : ""}
                        </p>
                        <p className="muted">
                          {order.address.street}, {order.address.city}, {order.address.state} {order.address.pincode}
                        </p>
                      </div>
                    )}

                    <div className="surface-card" style={{ padding: "1rem" }}>
                      <h3 className="panel-title">Products in this shipment</h3>
                      {order.products?.map((product, index) => (
                        <div key={`${order._id}-${index}`} className="product-line">
                          {product?.image ? (
                            <img src={product.image} alt={product.name} className="order-thumb" />
                          ) : (
                            <div className="order-thumb" />
                          )}
                          <div>
                            <strong>{product?.name}</strong>
                            <p className="muted">Qty {product?.quantity}</p>
                          </div>
                          <strong>Rs {product?.price}</strong>
                        </div>
                      ))}
                    </div>

                    {!["shipped", "out for delivery", "delivered", "cancelled"].includes(status.toLowerCase()) && (
                      <div>
                        <button onClick={() => handleCancel(order._id)} className="danger-button">
                          Cancel Order
                        </button>
                      </div>
                    )}

                    {!isCancelled ? (
                      <div className="timeline-card">
                        <h3 className="panel-title">Fulfillment progress</h3>
                        <div className="timeline" style={{ marginTop: "1rem" }}>
                          {steps.map((step, index) => (
                            <div
                              key={step}
                              className={`timeline-step ${
                                index < currentStep ? "done" : index === currentStep ? "current" : ""
                              }`}
                            >
                              <div className="timeline-node">{index < currentStep ? "OK" : index + 1}</div>
                              <div className="timeline-label">{step}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="timeline-card">
                        <h3 className="panel-title" style={{ color: "#b3261e" }}>Order cancelled</h3>
                        <p className="muted">This shipment was stopped before the final delivery stages.</p>
                      </div>
                    )}

                    <div>
                      <span className={`status-badge ${isCancelled ? "cancelled" : "online"}`}>
                        Current status: {status}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default TrackOrder;
