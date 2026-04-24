import { useEffect, useState } from "react";
import { CartContext } from "./cartContextInstance";

export const CartProvider = ({ children }) => {

  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ unique key per user
  const cartKey = user?._id ? `cart_${user._id}` : "cart_guest";

  // 🧠 Load cart (user specific)
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(cartKey);
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.log("Error loading cart:", err);
      return [];
    }
  });

  // 💾 Save cart
  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(cart));
  }, [cart, cartKey]);

  // ➕ Add to cart
  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item._id === product._id);

      if (existing) {
        return prev.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }

      return [
        ...prev,
        {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.image || "",
          quantity: qty
        }
      ];
    });
  };

  // ➕
  const increaseQty = (id) => {
    setCart(prev =>
      prev.map(item =>
        item._id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // ➖
  const decreaseQty = (id) => {
    setCart(prev =>
      prev
        .map(item =>
          item._id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  // ❌ Remove item
  const removeItem = (id) => {
    setCart(prev => prev.filter(item => item._id !== id));
  };

  // 🧹 Clear cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem(cartKey);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQty,
        decreaseQty,
        removeItem,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
