const Razorpay = require("razorpay");
const crypto = require("crypto");
const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Food = require("../models/Food");
const Order = require("../models/Order");

// @desc    Create Razorpay Order
// @route   POST /api/create-order
// @access  Public/Private
const createRazorpayOrder = async (req, res, next) => {
  try {
    const { userId, sessionId } = req.body;

    const rawUserId = userId || (req.user ? req.user._id : null);
    const validUserId = (rawUserId && mongoose.Types.ObjectId.isValid(rawUserId)) ? rawUserId : null;

    let query = {};
    if (validUserId) {
      query.user = validUserId;
    } else {
      query.sessionId = sessionId || "guest";
    }

    const cart = await Cart.findOne(query);

    if (!cart || !cart.items || cart.items.length === 0) {
      res.status(400);
      throw new Error("Your cart is empty. Cannot create payment order.");
    }

    // Fetch all catalog food IDs for accurate backend price calculation
    const itemIds = cart.items.map((i) => i.id).filter(Boolean);
    const mongoFoods = await Food.find({
      $or: [{ _id: { $in: itemIds.filter((id) => mongoose.Types.ObjectId.isValid(id)) } }, { id: { $in: itemIds } }],
    });

    const foodMap = new Map();
    mongoFoods.forEach((f) => {
      if (f._id) foodMap.set(f._id.toString(), f.price);
      if (f.id) foodMap.set(f.id.toString(), f.price);
    });

    let totalAmountINR = 0;
    cart.items.forEach((item) => {
      const dbPrice = foodMap.get(String(item.id)) ?? item.price ?? 9.99;
      totalAmountINR += Number(dbPrice) * Number(item.quantity || 1);
    });

    // Add standard delivery/service charges matching frontend if applicable
    totalAmountINR += 8.98; // 5.99 delivery + 2.99 service fee

    // Convert total to paise (1 INR = 100 Paise)
    const amountInPaise = Math.round(totalAmountINR * 100);

    if (amountInPaise < 100) {
      res.status(400);
      throw new Error("Minimum payment amount is ₹1 (100 paise)");
    }

    const keyId = process.env.RAZORPAY_KEY_ID || "rzp_test_TJwGz8Ynnf8h0j";
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "P1VrGsXnruW7oksMisi9JDuv";

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.json({
      order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: keyId,
    });
  } catch (error) {
    console.error("❌ Error creating Razorpay Order:", error);
    next(error);
  }
};

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/verify-payment
// @access  Public/Private
const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, sessionId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      res.status(400);
      throw new Error("Missing required payment verification parameters");
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET || "P1VrGsXnruW7oksMisi9JDuv";

    // HMAC-SHA256 signature verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body.toString())
      .digest("hex");

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (!isSignatureValid) {
      res.status(400);
      return res.status(400).json({
        success: false,
        message: "Payment signature verification failed. Transaction rejected.",
      });
    }

    // Payment Verified! Retrieve user cart from MongoDB
    const rawUserId = userId || (req.user ? req.user._id : null);
    const validUserId = (rawUserId && mongoose.Types.ObjectId.isValid(rawUserId)) ? rawUserId : null;

    let query = {};
    if (validUserId) {
      query.user = validUserId;
    } else {
      query.sessionId = sessionId || "guest";
    }

    const cart = await Cart.findOne(query);

    const itemsToSave = (cart && cart.items && cart.items.length > 0) ? cart.items : [];

    const formattedOrderItems = itemsToSave.map((item) => ({
      id: String(item.id || item._id || Date.now()),
      title: item.title || item.name || "Meal Item",
      price: Number(item.price || 0),
      quantity: Number(item.quantity || 1),
      image: item.image || "",
    }));

    const calculatedTotal = formattedOrderItems.reduce((acc, i) => acc + (i.price * i.quantity), 0) + 8.98;

    // Create Order document in MongoDB with Paid status and Razorpay IDs
    const createdOrder = await Order.create({
      user: validUserId,
      orderItems: formattedOrderItems,
      totalAmount: calculatedTotal,
      status: "Pending",
      paymentStatus: "Paid",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    });

    // Clear user cart in MongoDB after successful payment verification
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      order: createdOrder,
    });
  } catch (error) {
    console.error("❌ Payment Verification Error:", error);
    next(error);
  }
};

// @desc    Create Razorpay Order for existing pending order
// @route   POST /api/retry-payment
// @access  Public/Private
const createRetryRazorpayOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
      res.status(400);
      throw new Error("Valid order ID is required to complete payment");
    }

    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    const amountInPaise = Math.round(Number(order.totalAmount || 0) * 100);
    if (amountInPaise < 100) {
      res.status(400);
      throw new Error("Invalid order amount for Razorpay payment");
    }

    const keyId = process.env.RAZORPAY_KEY_ID || "rzp_test_TJwGz8Ynnf8h0j";
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "P1VrGsXnruW7oksMisi9JDuv";

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `retry_${order._id}_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.json({
      order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: keyId,
      existingOrderId: order._id,
    });
  } catch (error) {
    console.error("❌ Error creating Retry Razorpay Order:", error);
    next(error);
  }
};

// @desc    Verify Razorpay Signature for existing pending order retry
// @route   POST /api/verify-retry-payment
// @access  Public/Private
const verifyRetryPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      res.status(400);
      throw new Error("Missing required payment verification parameters");
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET || "P1VrGsXnruW7oksMisi9JDuv";

    // HMAC-SHA256 signature verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment signature verification failed. Transaction rejected.",
      });
    }

    // Payment Verified! Update existing Order in MongoDB
    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404);
      throw new Error("Existing order document not found");
    }

    order.paymentStatus = "Paid";
    order.razorpayOrderId = razorpay_order_id;
    order.razorpayPaymentId = razorpay_payment_id;

    const updatedOrder = await order.save();
    await updatedOrder.populate("user", "name username email role");

    res.status(200).json({
      success: true,
      message: "Payment completed successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("❌ Retry Payment Verification Error:", error);
    next(error);
  }
};

module.exports = {
  createRazorpayOrder,
  verifyPayment,
  createRetryRazorpayOrder,
  verifyRetryPayment,
};
