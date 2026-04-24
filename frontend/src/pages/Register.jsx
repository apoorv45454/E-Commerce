import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useFeedback } from "../context/useFeedback";
import { validateRegisterForm } from "../utils/authValidation";

function Register() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const { queueFlashToast, showToast } = useFeedback();

  const handleRegister = async () => {
    const nextErrors = validateRegisterForm(data);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      showToast({
        title: "Registration details need attention",
        message: "Please fix the form errors and try again.",
        tone: "warning"
      });
      return;
    }

    try {
      await axios.post(import.meta.env.VITE_API_URL + "/users/register", data);
      queueFlashToast({
        title: "Account created",
        message: "Your account is ready. Please log in to continue.",
        tone: "success"
      });
      window.location.href = "/login";
    } catch (err) {
      showToast({
        title: "Registration failed",
        message: err.response?.data?.msg || "Account could not be created.",
        tone: "error"
      });
    }
  };

  return (
    <div className="auth-shell">
      <div className="page-container auth-grid fade-in">
        <section className="auth-panel">
          <div className="auth-copy">
            <span className="page-eyebrow">Create Workspace</span>
            <h1 className="auth-title">Build your customer account for faster fulfillment.</h1>
            <p>
              Save delivery details once, move through checkout faster, and keep every order
              visible through the full dispatch timeline.
            </p>
            <div className="mini-list">
              <div className="mini-item">
                <h3>Address-ready checkout</h3>
                <p>Store and reuse addresses during order placement without breaking flow.</p>
              </div>
              <div className="mini-item">
                <h3>Tracking from first purchase</h3>
                <p>Each order automatically appears in the tracking workspace after placement.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="auth-panel">
          <div className="auth-copy">
            <span className="page-eyebrow">Registration</span>
            <h2 className="panel-title" style={{ marginBottom: 0 }}>
              Set up your ShopKart profile
            </h2>
            <p className="form-caption">A few details now for smoother buying and tracking later.</p>
          </div>

          <div className="auth-form">
            <input
              className="input"
              placeholder="Name"
              value={data.name}
              onChange={(e) => {
                setData({ ...data, name: e.target.value });
                setErrors((prev) => ({ ...prev, name: "" }));
              }}
            />
            {errors.name && <p className="field-error">{errors.name}</p>}
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
            <p className="form-caption">
              Password must use 8 or more characters with uppercase, lowercase, number, and special character.
            </p>
            <button onClick={handleRegister} className="primary-button">
              Register
            </button>
            <p className="form-caption">
              Already have an account? <Link to="/login" className="pill-link">Login here</Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Register;
