const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },

    products: [
      {
        _id: String, // ✅ product id for stock update
        name: String,
        price: Number,
        quantity: Number,
        image: String
      }
    ],

    totalAmount: {
      type: Number,
      required: true
    },

    paymentMethod: {
      type: String,
      enum: ["Online", "COD"],
      default: "COD"
    },

    paymentId: String,

    // ✅ FIXED ENUM (added Cancelled)
    status: {
      type: String,
      enum: [
        "Placed",
        "Confirmed",
        "Packed",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled" // 🔥 IMPORTANT FIX
      ],
      default: "Placed"
    },

    address: {
      name: String,
      phone: String,
      street: String,
      city: String,
      state: String,
      pincode: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);