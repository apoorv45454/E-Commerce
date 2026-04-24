import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { CartProvider } from "./context/CartContext";
import { FeedbackProvider } from "./context/FeedbackContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <FeedbackProvider>
    <CartProvider>
      <App />
    </CartProvider>
  </FeedbackProvider>
);
