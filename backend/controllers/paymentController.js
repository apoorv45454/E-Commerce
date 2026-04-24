const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Order for payment
exports.createPaymentOrder = async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100, // paisa
    currency: "INR",
    receipt: "order_rcptid_" + Date.now()
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({ msg: "Payment error" });
  }
};