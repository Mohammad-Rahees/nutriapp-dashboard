const mongoose = require("mongoose");
const Order = require("../models/Order");

// @desc    Create new order
// @route   POST /api/orders
// @access  Public/Private
const createOrder = async (req, res, next) => {
  try {
    const { orderItems, totalAmount, userId } = req.body;

    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items provided");
    }

    const formattedItems = orderItems.map((item) => ({
      id: String(item.id || item._id || Date.now()),
      title: item.title || item.name || "Meal Item",
      price: Number(item.price || 0),
      quantity: Number(item.quantity || 1),
      image: item.image || "",
    }));

    const rawUserId = userId || (req.user ? req.user._id : null);
    const validUserId = (rawUserId && mongoose.Types.ObjectId.isValid(rawUserId)) ? rawUserId : null;

    const calculatedTotal = Number(totalAmount) || formattedItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);

    const order = new Order({
      user: validUserId,
      orderItems: formattedItems,
      totalAmount: calculatedTotal,
      status: "In Transit",
    });

    const createdOrder = await order.save();
    console.log("✅ Order saved successfully into MongoDB orders collection:", createdOrder._id);
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("❌ Error creating order in MongoDB:", error);
    next(error);
  }
};

// @desc    Get all orders / user orders
// @route   GET /api/orders
// @access  Public/Private
const getOrders = async (req, res, next) => {
  try {
    const { userId } = req.query;
    let query = {};
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      query.user = userId;
    } else if (req.user && req.user._id) {
      query.user = req.user._id;
    }

    const orders = await Order.find(query)
      .populate("user", "name username email role")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status or PUT /api/orders/:id
// @access  Admin/Private
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["Pending", "Preparing", "Shipped", "In Transit", "Delivered", "Cancelled"];
    if (!status || !validStatuses.includes(status)) {
      res.status(400);
      throw new Error(`Invalid order status. Allowed values: ${validStatuses.join(", ")}`);
    }

    const order = await Order.findById(id);
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    order.status = status;
    const updatedOrder = await order.save();
    await updatedOrder.populate("user", "name username email role");

    console.log(`✅ Order ${id} status updated to: ${status}`);
    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus,
};
