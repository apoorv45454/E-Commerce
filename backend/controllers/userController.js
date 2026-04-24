const User = require("../models/User");

// Register
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 🔍 Check if email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        msg: "User already exists with this email"
      });
    }

    // ✅ Create new user
    const user = await User.create({ name, email, password });

    res.json(user);

  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, password });

  if (!user) return res.status(400).json({ msg: "Invalid credentials" });

  // Send role also
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  });
};