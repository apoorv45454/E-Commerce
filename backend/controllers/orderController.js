const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

// 📦 CREATE ORDER
exports.createOrder = async (req, res) => {
  try {
    const { products } = req.body;

    // ✅ 1. CHECK STOCK BEFORE ORDER
    for (let item of products) {
      const product = await Product.findById(item._id);

      if (!product) {
        return res.status(404).json({ msg: "Product not found" });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          msg: `Only ${product.stock} items left for ${product.name}`
        });
      }
    }

    // ✅ 2. UPDATE STOCK
    for (let item of products) {
      await Product.findByIdAndUpdate(
        item._id,
        { $inc: { stock: -item.quantity } }
      );
    }

    // ✅ 3. CREATE ORDER AFTER STOCK UPDATE
    const order = await Order.create(req.body);

    res.json(order);

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error creating order" });
  }
};


// 📥 GET ALL ORDERS (GENERAL)
exports.getOrders = async (req, res) => {
  try {
    const { userId } = req.query;

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json(error);
  }
};


// 👤 GET USER ORDERS
exports.getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// 🔄 UPDATE STATUS (GENERAL)
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// 🛠 ADMIN - ALL ORDERS
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    const userIds = [...new Set(orders.map((order) => order.userId).filter(Boolean))];
    const users = await User.find({ _id: { $in: userIds } }, { name: 1 });
    const userMap = new Map(users.map((user) => [String(user._id), user.name]));

    res.json(
      orders.map((order) => ({
        ...order.toObject(),
        userName: userMap.get(String(order.userId)) || "Unknown customer"
      }))
    );
  } catch (err) {
    res.status(500).json(err);
  }
};


// 🛠 ADMIN - UPDATE STATUS
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    // ❌ BLOCK if already cancelled
    if (order.status === "Cancelled") {
      return res.status(400).json({
        msg: "Cannot update a cancelled order"
      });
    }

    // ❌ BLOCK invalid backward updates (optional strong logic)
    const blockedStatuses = ["Delivered"];
    if (blockedStatuses.includes(order.status)) {
      return res.status(400).json({
        msg: "Order already completed"
      });
    }

    order.status = status;
    await order.save();

    res.json(order);

  } catch (err) {
    res.status(500).json(err);
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    console.log("Cancel API HIT ✅");

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    console.log("Order Status:", order.status);

    // ✅ If status missing → treat as Placed
    const status = (order.status || "Placed").toLowerCase();

    // 🚫 Block only after shipped
    if (
      status === "shipped" ||
      status === "out for delivery" ||
      status === "delivered"
    ) {
      return res.status(400).json({
        msg: `Cannot cancel order at status: ${order.status}`
      });
    }

    // ✅ Restore stock SAFELY
    if (order.products && order.products.length > 0) {
      for (let item of order.products) {
        if (item._id) {
          await Product.findByIdAndUpdate(
            item._id,
            { $inc: { stock: item.quantity } }
          );
        }
      }
    }

    // ✅ Update status
    order.status = "Cancelled";
    await order.save();

    res.json({ msg: "Order Cancelled Successfully" });

  } catch (err) {
    console.log("Cancel Error:", err);
    res.status(500).json({ msg: "Cancel failed" });
  }
};
