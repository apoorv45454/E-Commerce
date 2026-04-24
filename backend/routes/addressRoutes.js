const express = require("express");
const router = express.Router();

const {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress
} = require("../controllers/addressController");

router.post("/add", addAddress);
router.get("/:userId", getAddresses);
router.put("/update/:id", updateAddress);
router.delete("/delete/:id", deleteAddress);

module.exports = router;