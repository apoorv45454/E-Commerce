const Product = require("../models/Product");

// ➕ Add Product
exports.addProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: "Error adding product" });
  }
};

// 📥 Get All Products
exports.getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

// ✏️ Update Product
exports.updateProduct = async (req, res) => {
  const { id } = req.params;

  const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });
  res.json(updated);
};

// ❌ Delete Product
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  await Product.findByIdAndDelete(id);
  res.json({ msg: "Deleted successfully" });
};