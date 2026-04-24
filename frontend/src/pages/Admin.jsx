import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Admin() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    originalPrice: "",
    description: "",
    image: "",
    stock: ""
  });
  const [editId, setEditId] = useState(null);

  const fetchProducts = () => {
    axios.get(import.meta.env.VITE_API_URL + "/products").then((res) => setProducts(res.data));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async () => {
    if (editId) {
      await axios.put(`${import.meta.env.VITE_API_URL}/products/update/${editId}`, form);
      setEditId(null);
    } else {
      await axios.post(import.meta.env.VITE_API_URL + "/products/add", form);
    }

    setForm({
      name: "",
      price: "",
      originalPrice: "",
      description: "",
      image: "",
      stock: ""
    });

    fetchProducts();
  };

  const handleEdit = (product) => {
    setForm(product);
    setEditId(product._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${import.meta.env.VITE_API_URL}/products/delete/${id}`);
    fetchProducts();
  };

  const lowStock = products.filter((product) => Number(product.stock) <= 5).length;

  return (
    <main className="page">
      <div className="page-container fade-in">
        <section className="page-header">
          <div className="admin-toolbar">
            <div>
              <span className="page-eyebrow">Admin Inventory Console</span>
              <h1 className="page-title">Manage catalog supply with a cleaner operations dashboard.</h1>
            </div>
            <button onClick={() => navigate("/admin/orders")} className="secondary-button">
              View Orders
            </button>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Products listed</div>
              <div className="stat-value">{products.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Low stock alerts</div>
              <div className="stat-value">{lowStock}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Mode</div>
              <div className="stat-value">{editId ? "Updating item" : "Adding item"}</div>
            </div>
          </div>
        </section>

        <section className="section admin-layout" style={{ display: "grid", gap: "1.5rem", marginTop: "1.5rem" }}>
          <div className="admin-card">
            <div className="split-header">
              <div>
                <h2 className="section-title">{editId ? "Update product" : "Create product"}</h2>
                <p className="section-copy">The CRUD flow stays the same while the form becomes easier to scan.</p>
              </div>
            </div>

            <div className="form-grid" style={{ marginTop: "1rem" }}>
              <div className="field-row">
                <input
                  placeholder="Product Name"
                  className="input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                  placeholder="Price"
                  className="input"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>

              <div className="field-row">
                <input
                  placeholder="Original Price"
                  className="input"
                  value={form.originalPrice}
                  onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                />
                <input
                  placeholder="Stock"
                  className="input"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                />
              </div>

              <input
                placeholder="Image URL"
                className="input"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />

              <textarea
                placeholder="Description"
                className="textarea"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />

              <button onClick={handleSubmit} className="primary-button">
                {editId ? "Update Product" : "Add Product"}
              </button>
            </div>
          </div>

          <aside className="admin-card">
            <h2 className="section-title">Inventory pulse</h2>
            <div className="mini-stat-grid" style={{ marginTop: "1rem" }}>
              <div className="metric-item">
                <strong>{products.filter((product) => Number(product.stock) > 0).length}</strong>
                <span>active SKUs</span>
              </div>
              <div className="metric-item">
                <strong>{products.filter((product) => Number(product.stock) === 0).length}</strong>
                <span>out of stock</span>
              </div>
            </div>
            <p className="section-copy" style={{ marginTop: "1rem" }}>
              Use the orders screen to continue the workflow from inventory into shipping status updates.
            </p>
          </aside>
        </section>

        <section className="section">
          <div className="split-header">
            <div>
              <h2 className="section-title">Current catalog</h2>
              <p className="section-copy">Every product card exposes stock and pricing at a glance.</p>
            </div>
          </div>

          <div className="catalog-grid" style={{ marginTop: "1rem" }}>
            {products.map((product) => {
              const hasDiscount = Number(product.originalPrice) > Number(product.price);

              return (
                <article key={product._id} className="catalog-item">
                  <img src={product.image || "https://via.placeholder.com/200"} alt={product.name} />
                  <div className="info-row">
                    <h3 className="panel-title" style={{ marginBottom: 0 }}>{product.name}</h3>
                    <span className={`badge ${Number(product.stock) > 5 ? "success" : "warn"}`}>
                      Stock {product.stock}
                    </span>
                  </div>
                  <div className="price-row">
                    <span className="price-main">Rs {product.price}</span>
                    {hasDiscount && <span className="price-strike">Rs {product.originalPrice}</span>}
                  </div>
                  <p className="muted">{product.description}</p>

                  <div className="button-row" style={{ marginTop: "1rem" }}>
                    <button onClick={() => handleEdit(product)} className="ghost-button">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(product._id)} className="danger-button">
                      Delete
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

export default Admin;
