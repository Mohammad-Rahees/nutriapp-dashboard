const mongoose = require("mongoose");
const Order = require("../models/Order");
const User = require("../models/User");

// @desc    Create new order
// @route   POST /api/orders
// @access  Public/Private
const createOrder = async (req, res, next) => {
  try {
    const { orderItems, totalAmount, userId, deliveryAddress, deliveryPhone, location } = req.body;

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

    let finalAddress = deliveryAddress || "";
    let finalPhone = deliveryPhone || "";
    let finalLocation = location || null;

    if (validUserId) {
      const userDoc = await User.findById(validUserId);
      if (userDoc) {
        if (!finalAddress) {
          const parts = [userDoc.address, userDoc.city, userDoc.state, userDoc.postalCode].filter(Boolean);
          finalAddress = parts.join(", ");
        }
        if (!finalPhone) {
          finalPhone = userDoc.phone || "";
        }
        if (!finalLocation && userDoc.latitude && userDoc.longitude) {
          finalLocation = { lat: userDoc.latitude, lng: userDoc.longitude };
        }
      }
    }

    const calculatedTotal = Number(totalAmount) || formattedItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);

    const order = new Order({
      user: validUserId,
      orderItems: formattedItems,
      totalAmount: calculatedTotal,
      status: "In Transit",
      deliveryAddress: finalAddress,
      deliveryPhone: finalPhone,
      location: finalLocation,
    });

    const createdOrder = await order.save();
    console.log("✅ Order saved successfully into MongoDB orders collection:", createdOrder._id);
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("❌ Error creating order in MongoDB:", error);
    next(error);
  }
};

// @desc    Get all orders / user orders / assigned delivery orders
// @route   GET /api/orders
// @access  Public/Private
const getOrders = async (req, res, next) => {
  try {
    const { userId, deliveryPerson } = req.query;
    let query = {};

    if (deliveryPerson && mongoose.Types.ObjectId.isValid(deliveryPerson)) {
      query.deliveryPerson = deliveryPerson;
    } else if (req.user && req.user.role && req.user.role.toLowerCase() === "delivery") {
      query.deliveryPerson = req.user._id;
    } else if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      query.user = userId;
    } else if (req.user && req.user.role && req.user.role.toLowerCase() === "customer") {
      query.user = req.user._id;
    }

    const orders = await Order.find(query)
      .populate("user", "name username email phone address city state postalCode role")
      .populate("deliveryPerson", "name username email phone role")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Update overall order status (e.g. Preparing, Shipped, Delivered)
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
    if (status === "Delivered") {
      order.deliveryStatus = "Delivered";
      order.deliveredAt = new Date();
    }
    const updatedOrder = await order.save();
    await updatedOrder.populate("user", "name username email phone address role");
    await updatedOrder.populate("deliveryPerson", "name username email phone role");

    console.log(`✅ Order ${id} status updated to: ${status}`);
    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Assign delivery person to order (Admin endpoint)
// @route   PUT /api/orders/:id/assign
// @access  Admin/Private
const assignDeliveryPerson = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { deliveryPersonId, estimatedDeliveryTime, deliveryAddress, deliveryPhone } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    if (deliveryPersonId && mongoose.Types.ObjectId.isValid(deliveryPersonId)) {
      order.deliveryPerson = deliveryPersonId;
      order.deliveryStatus = "Assigned";
      order.assignedAt = new Date();
    } else if (deliveryPersonId === null || deliveryPersonId === "") {
      order.deliveryPerson = null;
      order.deliveryStatus = "Unassigned";
      order.assignedAt = null;
    }

    if (estimatedDeliveryTime) {
      order.estimatedDeliveryTime = estimatedDeliveryTime;
    }
    if (deliveryAddress) {
      order.deliveryAddress = deliveryAddress;
    }
    if (deliveryPhone) {
      order.deliveryPhone = deliveryPhone;
    }

    const updatedOrder = await order.save();
    await updatedOrder.populate("user", "name username email phone address role");
    await updatedOrder.populate("deliveryPerson", "name username email phone role");

    console.log(`✅ Order ${id} assigned to delivery person: ${deliveryPersonId}`);
    res.json(updatedOrder);
  } catch (error) {
    console.error("❌ Error assigning delivery person:", error);
    next(error);
  }
};

// @desc    Update delivery workflow status & COD collection (Delivery endpoint)
// @route   PUT /api/orders/:id/delivery-status
// @access  Delivery/Admin/Private
const updateDeliveryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { deliveryStatus, paymentCollected } = req.body;

    const validDeliveryStatuses = ["Assigned", "Picked Up", "Out for Delivery", "Delivered", "Failed Delivery"];
    if (deliveryStatus && !validDeliveryStatuses.includes(deliveryStatus)) {
      res.status(400);
      throw new Error(`Invalid delivery status. Allowed values: ${validDeliveryStatuses.join(", ")}`);
    }

    const order = await Order.findById(id);
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    // Security check: If request user is a delivery person, verify they are assigned to this order
    if (req.user && req.user.role && req.user.role.toLowerCase() === "delivery") {
      if (order.deliveryPerson && order.deliveryPerson.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Access denied: You can only update orders assigned to you.");
      }
    }

    if (deliveryStatus) {
      order.deliveryStatus = deliveryStatus;
      if (deliveryStatus === "Delivered") {
        order.status = "Delivered";
        order.deliveredAt = new Date();
      } else if (deliveryStatus === "Out for Delivery") {
        order.status = "In Transit";
      }
    }

    if (paymentCollected !== undefined) {
      order.paymentCollected = Boolean(paymentCollected);
      if (order.paymentCollected) {
        order.paymentStatus = "Paid";
      }
    }

    const updatedOrder = await order.save();
    await updatedOrder.populate("user", "name username email phone address role");
    await updatedOrder.populate("deliveryPerson", "name username email phone role");

    console.log(`✅ Order ${id} delivery status updated to: ${deliveryStatus || 'unchanged'}, paymentCollected: ${order.paymentCollected}`);
    res.json(updatedOrder);
  } catch (error) {
    console.error("❌ Error updating delivery status:", error);
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus,
  assignDeliveryPerson,
  updateDeliveryStatus,
};
