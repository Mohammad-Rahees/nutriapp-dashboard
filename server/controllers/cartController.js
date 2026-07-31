const Cart = require("../models/Cart");

// @desc    Get user cart
// @route   GET /api/cart
// @access  Public/Private
const getCart = async (req, res, next) => {
  try {
    const { userId, sessionId } = req.query;
    let query = {};
    if (userId) query.user = userId;
    else if (req.user) query.user = req.user._id;
    else query.sessionId = sessionId || "guest";

    let cart = await Cart.findOne(query);
    if (!cart) {
      cart = await Cart.create({ ...query, items: [] });
    }
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

// @desc    Save/Sync cart items
// @route   POST /api/cart
// @access  Public/Private
const saveCart = async (req, res, next) => {
  try {
    const { userId, sessionId, items } = req.body;
    let query = {};
    if (userId) query.user = userId;
    else if (req.user) query.user = req.user._id;
    else query.sessionId = sessionId || "guest";

    let cart = await Cart.findOne(query);
    if (cart) {
      cart.items = items || [];
      await cart.save();
    } else {
      cart = await Cart.create({ ...query, items: items || [] });
    }
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Public/Private
const clearCart = async (req, res, next) => {
  try {
    const { userId, sessionId } = req.query;
    let query = {};
    if (userId) query.user = userId;
    else if (req.user) query.user = req.user._id;
    else query.sessionId = sessionId || "guest";

    let cart = await Cart.findOne(query);
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ message: "Cart cleared successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  saveCart,
  clearCart,
};
