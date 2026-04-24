import { useEffect, useState } from "react";
import axios from "axios";
import { useFeedback } from "../context/useFeedback";

function Products() {
  const [products, setProducts] = useState([]);
  const { showDialog, showToast } = useFeedback();


  useEffect(() => {
    axios.get(import.meta.env.VITE_API_URL + "/products")
      .then(res => setProducts(res.data));
  }, []);

  const placeOrder = async (product) => {
    const user = JSON.parse(localStorage.getItem("user"));

    try {
      await axios.post(import.meta.env.VITE_API_URL + "/orders/create", {
        userId: user?._id,
        products: [{
          name: product.name,
          quantity: 1,
          price: product.price
        }],
        totalAmount: product.price
      });

      showDialog({
        title: "Order placed successfully",
        message: `${product.name} has been submitted into the order queue.`,
        tone: "success",
        confirmLabel: "Continue"
      });
    } catch (error) {
      showToast({
        title: "Order failed",
        message: error?.response?.data?.msg || "The order could not be placed.",
        tone: "error"
      });
    }
  };

  return (
    <div>
      {products.map(p => (
        <div key={p._id}>
          <h2>{p.name}</h2>
          <p>₹{p.price}</p>
          <button onClick={() => placeOrder(p)}>Buy Now</button>
        </div>
      ))}
    </div>
  );
}

export default Products;
