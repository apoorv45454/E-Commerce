import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import TrackOrder from "./pages/TrackOrder";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import Checkout from "./pages/Checkout";
import AdminOrders from "./pages/AdminOrders";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthRoute from "./components/AuthRoute";
import { useFeedback } from "./context/useFeedback";

function App() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const { confirmAction, queueFlashToast } = useFeedback();

  const customerLinks = [
    { to: "/home", label: "Catalog" },
    { to: "/cart", label: "Cart" },
    { to: "/track", label: "Tracking" }
  ];

  const adminLinks = [
    { to: "/admin", label: "Inventory" },
    { to: "/admin/orders", label: "Orders" }
  ];

  const links = user?.role === "admin" ? adminLinks : customerLinks;

  const handleLogout = async () => {
    const confirmed = await confirmAction({
      title: "Log out of ShopKart?",
      message: "You will be returned to the landing page and your current session will end.",
      tone: "warning",
      confirmLabel: "Logout"
    });

    if (!confirmed) return;

    localStorage.removeItem("user");
    queueFlashToast({
      title: "Logged out",
      message: "You have safely signed out of your workspace.",
      tone: "success"
    });
    window.location.href = "/";
  };

  return (
    <Router>
      <div className="app-shell">
        {user && (
          <header className="topbar">
            <div className="topbar-inner">
              <NavLink to={user.role === "admin" ? "/admin" : "/home"} className="brand-lockup">
                <img src="/logo-mark.svg" alt="ShopKart logo" className="brand-logo" />
                <div className="brand-copy">
                  <strong>ShopKart Control</strong>
                  <span>
                    {user.role === "admin" ? "Fulfillment cockpit" : "Track every order touchpoint"}
                  </span>
                </div>
              </NavLink>

              <nav className="topbar-nav">
                {links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) => `nav-pill ${isActive ? "active" : ""}`}
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>

              <div className="topbar-actions">
                <div className="user-chip">
                  {user.role === "admin" ? "Admin" : user.name || "User"}
                </div>
                <button
                  className="logout-button"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </header>
        )}

        <Routes>
          <Route
            path="/"
            element={!user ? <Landing /> : <Navigate to={user.role === "admin" ? "/admin" : "/home"} />}
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute role="user">
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <AuthRoute>
                <Login />
              </AuthRoute>
            }
          />
          <Route
            path="/register"
            element={
              <AuthRoute>
                <Register />
              </AuthRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute role="user">
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/track"
            element={
              <ProtectedRoute role="user">
                <TrackOrder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute role="admin">
                <AdminOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute role="user">
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
