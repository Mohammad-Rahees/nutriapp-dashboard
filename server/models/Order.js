const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    orderItems: [
      {
        id: String,
        title: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, default: 1 },
        image: String,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "Preparing", "Shipped", "In Transit", "Delivered", "Cancelled"],
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    razorpayOrderId: {
      type: String,
    },
    razorpayPaymentId: {
      type: String,
    },
    estimatedDeliveryTime: {
      type: String,
      default: "25-30 min",
    },
    deliveryPerson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    deliveryStatus: {
      type: String,
      enum: ["Unassigned", "Assigned", "Picked Up", "Out for Delivery", "Delivered", "Failed Delivery"],
      default: "Unassigned",
    },
    assignedAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
    paymentCollected: {
      type: Boolean,
      default: false,
    },
    deliveryAddress: {
      type: String,
      default: "",
    },
    deliveryPhone: {
      type: String,
      default: "",
    },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
