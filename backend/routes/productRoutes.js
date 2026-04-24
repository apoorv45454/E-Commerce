const express = require("express");
const router = express.Router();

const {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

router.post("/add", addProduct);
router.get("/", getProducts);
router.put("/update/:id", updateProduct);
router.delete("/delete/:id", deleteProduct);

module.exports = router;