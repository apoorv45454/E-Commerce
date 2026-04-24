const Address = require("../models/Address");

// ➕ Add Address
exports.addAddress = async (req, res) => {
  try {
    const address = await Address.create(req.body);
    res.json(address);
  } catch {
    res.status(500).json({ msg: "Error adding address" });
  }
};

// 📥 Get Addresses
exports.getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.params.userId });
    res.json(addresses);
  } catch {
    res.status(500).json({ msg: "Error fetching addresses" });
  }
};

// ✏️ Update Address
exports.updateAddress = async (req, res) => {
  try {
    const updated = await Address.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch {
    res.status(500).json({ msg: "Error updating address" });
  }
};

// 🗑️ Delete Address
exports.deleteAddress = async (req, res) => {
  try {
    await Address.findByIdAndDelete(req.params.id);
    res.json({ msg: "Address deleted" });
  } catch {
    res.status(500).json({ msg: "Error deleting address" });
  }
};