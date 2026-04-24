import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useFeedback } from "../context/useFeedback";
import { validateLoginForm } from "../utils/authValidation";

function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const { queueFlashToast, showToast } = useFeedback();

  const handleLogin = async () => {
    const nextErrors = validateLoginForm(data);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      showToast({
        title: "Login details need attention",
        message: "Please correct the highlighted fields and try again.",
        tone: "warning"
      });
      return;
    }

    try {
      const res = await axios.post(import.meta.env.VITE_API_URL + "/users/login", data);

      localStorage.setItem("user", JSON.stringify(res.data));
      queueFlashToast({
        title: "Welcome back",
        message: `Signed in as ${res.data.name}.`,
        tone: "success"
      });
      window.location.href = res.data.role === "admin" ? "/admin" : "/home";
    } catch (err) {
      console.log(err);
      showToast({
        title: "Login failed",
        message: err?.response?.data?.msg || "Please verify your email and password.",
        tone: "error"
      });
    }
  };

  return (
    <div className="auth-shell">
      <div className="page-container auth-grid fade-in">
        <section className="auth-panel">
          <div className="auth-copy">
            <span className="page-eyebrow">Secure Access</span>
            <h1 className="auth-title">Sign in to the order intelligence layer.</h1>
            <p>
              Move between catalog, cart, checkout, and live tracking with a cleaner,
              more operations-ready storefront experience.
            </p>
            <div className="feature-list">
              <div className="feature-item">
                <h3>Unified customer flow</h3>
                <p>Browse products, manage addresses, and track deliveries from one account.</p>
              </div>
              <div className="feature-item">
                <h3>Admin routing built in</h3>
                <p>Admin users land directly in the inventory and fulfillment dashboard.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="auth-panel">
          <div className="auth-copy">
            <span className="page-eyebrow">Welcome Back</span>
            <h2 className="panel-title" style={{ marginBottom: 0 }}>
              Continue where your last order left off
            </h2>
            <p className="form-caption">Use your registered email and password to continue.</p>
          </div>

          <div className="auth-form">
            <input
              className="input"
              placeholder="Email"
              value={data.email}
              onChange={(e) => {
                setData({ ...data, email: e.target.value });
                setErrors((prev) => ({ ...prev, email: "" }));
              }}
            />
            {errors.email && <p className="field-error">{errors.email}</p>}
            <input
              type="password"
              className="input"
              placeholder="Password"
              value={data.password}
              onChange={(e) => {
                setData({ ...data, password: e.target.value });
                setErrors((prev) => ({ ...prev, password: "" }));
              }}
            />
            {errors.password && <p className="field-error">{errors.password}</p>}
            <button onClick={handleLogin} className="primary-button">
              Login
            </button>
            <p className="form-caption">
              New to ShopKart? <Link to="/register" className="pill-link">Create an account</Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Login;
