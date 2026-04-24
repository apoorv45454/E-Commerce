import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { CartContext } from "../context/cartContextInstance";
import { useFeedback } from "../context/useFeedback";

function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const user = JSON.parse(localStorage.getItem("user"));
  const [paymentMethod, setPaymentMethod] = useState("Online");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [editId, setEditId] = useState(null);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: ""
  });
  const { showDialog, showToast } = useFeedback();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    if (user?._id) {
      axios.get(`${import.meta.env.VITE_API_URL}/address/${user._id}`).then((res) => setAddresses(res.data));
    }
  }, [user]);

  const handleAddAddress = async () => {
    if (!newAddress.street) {
      showToast({
        title: "Address is incomplete",
        message: "Street address is required before saving.",
        tone: "warning"
      });
      return;
    }

    const { data } = await axios.post(import.meta.env.VITE_API_URL + "/address/add", {
      ...newAddress,
      userId: user._id
    });

    setAddresses((prev) => [...prev, data]);
    showToast({
      title: "Address added",
      message: "The new delivery address is ready to use.",
      tone: "success"
    });
    setNewAddress({
      name: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      pincode: ""
    });
  };

  const handleEdit = (address) => {
    setEditId(address._id);
    setNewAddress(address);
  };

  const handleUpdateAddress = async () => {
    const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/address/update/${editId}`, newAddress);

    setAddresses((prev) => prev.map((address) => (address._id === editId ? data : address)));
    setEditId(null);
    showToast({
      title: "Address updated",
      message: "Your delivery details have been refreshed.",
      tone: "success"
    });
    setNewAddress({
      name: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      pincode: ""
    });
  };

  const handleDelete = async (id) => {
    await axios.delete(`${import.meta.env.VITE_API_URL}/address/delete/${id}`);
    setAddresses((prev) => prev.filter((address) => address._id !== id));
    showToast({
      title: "Address removed",
      message: "The selected address has been deleted.",
      tone: "success"
    });

    if (selectedAddress?._id === id) {
      setSelectedAddress(null);
    }
  };

  const saveOrder = async (paymentId = null) => {
    if (!selectedAddress) {
      showToast({
        title: "Address required",
        message: "Please select a delivery address before placing the order.",
        tone: "warning"
      });
      return;
    }

    try {
      await axios.post(import.meta.env.VITE_API_URL + "/orders/create", {
        userId: user._id,
        products: cart.map((item) => ({
          _id: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image
        })),
        totalAmount: total,
        paymentMethod,
        paymentId,
        status: "Placed",
        address: selectedAddress
      });

      clearCart();
      showDialog({
        title: "Order placed successfully",
        message: "Your order is confirmed and has entered the fulfillment pipeline.",
        tone: "success",
        confirmLabel: "Continue",
        onConfirm: () => {
          window.location.href = "/";
        }
      });
    } catch (err) {
      console.log(err);
      showToast({
        title: "Order failed",
        message: err?.response?.data?.msg || "The order could not be placed right now.",
        tone: "error"
      });
    }
  };

  const handleOnlinePayment = async () => {
    try {
      const { data } = await axios.post(import.meta.env.VITE_API_URL + "/payment/create-order", {
        amount: total
      });

      const options = {
        key: "rzp_test_Sg1vx8I440GPIq",
        amount: data.amount,
        order_id: data.id,
        handler: (res) => saveOrder(res.razorpay_payment_id)
      };

      new window.Razorpay(options).open();
    } catch {
      showToast({
        title: "Payment could not start",
        message: "The payment gateway is currently unavailable.",
        tone: "error"
      });
    }
  };

  if (cart.length === 0) {
    return (
      <main className="page">
        <div className="page-container fade-in">
          <section className="empty-state">
            <h1 className="section-title">Cart is empty.</h1>
            <p className="section-copy">Add products before entering the checkout and address workflow.</p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="page-container fade-in">
        <section className="page-header">
          <span className="page-eyebrow">Checkout Workflow</span>
          <h1 className="page-title">Delivery details, payment choice, and order review in one lane.</h1>
          <p className="page-subtitle">
            The purchase logic remains unchanged, but the interface now reads like a cleaner dispatch desk.
          </p>
        </section>

        <section className="section checkout-layout" style={{ display: "grid", gap: "1.5rem", marginTop: "1.5rem" }}>
          <div className="content-layout">
            <div className="surface-card">
              <div className="split-header">
                <div>
                  <h2 className="section-title">Order summary</h2>
                  <p className="section-copy">Every item queued for this shipment.</p>
                </div>
                <span className="badge success">Rs {total} total</span>
              </div>

              <div className="order-card-list" style={{ marginTop: "1rem" }}>
                {cart.map((item) => (
                  <div key={item._id} className="product-line">
                    <img src={item.image} alt={item.name} className="order-thumb" />
                    <div>
                      <h3 className="panel-title">{item.name}</h3>
                      <p className="muted">Qty {item.quantity}</p>
                    </div>
                    <strong>Rs {item.price * item.quantity}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-card">
              <div className="split-header">
                <div>
                  <h2 className="section-title">Delivery addresses</h2>
                  <p className="section-copy">Choose an existing address or create a new one.</p>
                </div>
              </div>

              <div className="address-list" style={{ marginTop: "1rem" }}>
                {addresses.map((address) => (
                  <div
                    key={address._id}
                    className={`address-card ${selectedAddress?._id === address._id ? "selected" : ""}`}
                    onClick={() => setSelectedAddress(address)}
                  >
                    <div className="address-head">
                      <h3 className="panel-title" style={{ marginBottom: 0 }}>
                        {address.name || "Saved address"}
                      </h3>
                      <span className="badge">{selectedAddress?._id === address._id ? "Selected" : "Choose"}</span>
                    </div>
                    <p className="muted">{address.phone}</p>
                    <p className="muted">{address.street}</p>
                    <p className="muted">
                      {address.city}
                      {address.city && address.state ? ", " : ""}
                      {address.state} {address.pincode}
                    </p>
                    <div className="inline-actions" style={{ marginTop: "0.75rem" }}>
                      <button
                        className="ghost-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(address);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="danger-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(address._id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-card">
              <h2 className="section-title">{editId ? "Update address" : "Add new address"}</h2>
              <div className="form-grid" style={{ marginTop: "1rem" }}>
                <div className="field-row">
                  <input
                    placeholder="Name"
                    className="input"
                    value={newAddress.name}
                    onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                  />
                  <input
                    placeholder="Phone Number"
                    className="input"
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  />
                </div>

                <input
                  placeholder="Street Address"
                  className="input"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                />

                <div className="field-row three">
                  <input
                    placeholder="City"
                    className="input"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  />
                  <input
                    placeholder="State"
                    className="input"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                  />
                  <input
                    placeholder="Pincode"
                    className="input"
                    value={newAddress.pincode}
                    onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                  />
                </div>

                <button onClick={editId ? handleUpdateAddress : handleAddAddress} className="primary-button">
                  {editId ? "Update Address" : "Add Address"}
                </button>
              </div>
            </div>
          </div>

          <aside className="summary-card">
            <h2 className="section-title">Payment selection</h2>
            <div className="status-list" style={{ marginTop: "1rem" }}>
              <div
                className={`select-card ${paymentMethod === "Online" ? "selected" : ""}`}
                onClick={() => setPaymentMethod("Online")}
              >
                <strong>Pay Online</strong>
                <p className="muted">Card, UPI, net banking</p>
              </div>
              <div
                className={`select-card ${paymentMethod === "COD" ? "selected" : ""}`}
                onClick={() => setPaymentMethod("COD")}
              >
                <strong>Cash on Delivery</strong>
                <p className="muted">Pay after delivery arrives</p>
              </div>
            </div>

            <div className="summary-row" style={{ marginTop: "1rem" }}>
              <span>Payment mode</span>
              <strong>{paymentMethod}</strong>
            </div>
            <div className="summary-row">
              <span>Delivery address</span>
              <strong>{selectedAddress ? "Ready" : "Required"}</strong>
            </div>
            <div className="summary-row">
              <span>Total payable</span>
              <strong className="price-main" style={{ fontSize: "1.35rem" }}>Rs {total}</strong>
            </div>

            {!selectedAddress && (
              <p className="muted" style={{ color: "#b3261e", marginTop: "0.9rem" }}>
                Please select a delivery address before placing the order.
              </p>
            )}

            <div className="button-row" style={{ marginTop: "1rem" }}>
              <button
                disabled={!selectedAddress}
                onClick={() => (paymentMethod === "Online" ? handleOnlinePayment() : saveOrder())}
                className="primary-button"
                style={{ opacity: selectedAddress ? 1 : 0.55 }}
              >
                Place Order
              </button>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

export default Checkout;
