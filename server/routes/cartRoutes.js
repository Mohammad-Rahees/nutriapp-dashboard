const express = require("express");
const router = express.Router();
const { getCart, saveCart, clearCart } = require("../controllers/cartController");

router.route("/")
  .get(getCart)
  .post(saveCart)
  .delete(clearCart);

module.exports = router;
