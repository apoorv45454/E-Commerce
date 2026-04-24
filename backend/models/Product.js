const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  originalPrice: Number, // for % off
  description: String,
  image: String,
  stock: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);