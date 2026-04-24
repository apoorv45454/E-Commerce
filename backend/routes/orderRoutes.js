const express = require("express");
const router = express.Router();

const { createOrder, getOrders, updateStatus } = require("../controllers/orderController");
const { getAllOrders } = require("../controllers/orderController");
const { updateOrderStatus } = require("../controllers/orderController");
const { cancelOrder } = require("../controllers/orderController");

router.post("/create", createOrder);
router.get("/", getOrders);
router.put("/update/:id", updateStatus);
router.get("/admin/all", getAllOrders);
router.put("/admin/update/:id", updateOrderStatus);
router.put("/cancel/:id", cancelOrder);

module.exports = router;