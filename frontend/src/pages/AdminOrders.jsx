import { useEffect, useState } from "react";
import axios from "axios";
import { useFeedback } from "../context/useFeedback";

const statuses = ["Placed", "Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered"];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const { showToast } = useFeedback();

  const fetchOrders = () => {
    axios
      .get(import.meta.env.VITE_API_URL + "/orders/admin/all")
      .then((res) => setOrders(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/orders/admin/update/${id}`, { status });
      fetchOrders();
      showToast({
        title: "Status updated",
        message: `Order moved to ${status}.`,
        tone: "success"
      });
    } catch (err) {
      showToast({
        title: "Status update failed",
        message: err?.response?.data?.msg || "Update failed",
        tone: "error"
      });
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

  const cancelledOrders = orders.filter((order) => order.status === "Cancelled").length;

  return (
    <main className="page">
      <div className="page-container fade-in">
        <section className="page-header">
          <span className="page-eyebrow">Fulfillment Control Tower</span>
          <h1 className="page-title">Update order status from intake to doorstep delivery.</h1>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Open orders</div>
              <div className="stat-value">{orders.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Cancelled</div>
              <div className="stat-value">{cancelledOrders}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Status stages</div>
              <div className="stat-value">{statuses.length}</div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="order-table">
            {orders.map((order) => (
              <article key={order._id} className="admin-card">
                <div className="track-meta">
                  <div>
                    <span className="page-eyebrow" style={{ color: "#102133", background: "rgba(16, 33, 51, 0.06)" }}>
                      Order {order._id.slice(-8)}
                    </span>
                    <p className="muted" style={{ marginTop: "0.6rem" }}>
                      Created {formatDate(order.createdAt)}
                    </p>
                    <p className="muted">Customer: {order.userName || order.userId}</p>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <strong className="price-main" style={{ display: "block" }}>Rs {order.totalAmount}</strong>
                    <span
                      className={`status-badge ${
                        order.status === "Cancelled"
                          ? "cancelled"
                          : order.paymentMethod === "Online"
                          ? "online"
                          : "cod"
                      }`}
                    >
                      {order.status === "Cancelled"
                        ? "Cancelled"
                        : order.paymentMethod === "Online"
                        ? "Paid Online"
                        : "COD"}
                    </span>
                  </div>
                </div>

                <div className="surface-card" style={{ padding: "1rem" }}>
                  <h3 className="panel-title">Shipment contents</h3>
                  {order.products?.map((product, index) => (
                    <div key={`${order._id}-${index}`} className="product-line">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="order-thumb" />
                      ) : (
                        <div className="order-thumb" />
                      )}
                      <div>
                        <strong>{product.name}</strong>
                        <p className="muted">Qty {product.quantity}</p>
                      </div>
                      <strong>Rs {product.price}</strong>
                    </div>
                  ))}
                </div>

                {order.address && (
                  <div className="surface-card" style={{ padding: "1rem" }}>
                    <h3 className="panel-title">Delivery destination</h3>
                    <p className="muted">
                      {order.address.name} {order.address.phone ? `| ${order.address.phone}` : ""}
                    </p>
                    <p className="muted">
                      {order.address.street}, {order.address.city}, {order.address.state} {order.address.pincode}
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="panel-title">Update status</h3>
                  {order.status === "Cancelled" ? (
                    <p className="muted" style={{ color: "#b3261e" }}>
                      Cancelled orders are locked and can no longer be moved through fulfillment.
                    </p>
                  ) : (
                    <div className="status-list" style={{ marginTop: "1rem" }}>
                      {statuses.map((status) => (
                        <div key={status} className={`status-chip ${order.status === status ? "active" : ""}`}>
                          <button onClick={() => updateStatus(order._id, status)}>{status}</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminOrders;
