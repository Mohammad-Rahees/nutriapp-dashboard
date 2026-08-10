const mongoose = require("mongoose");

const deliveryLogSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Delivery log must be associated with an order"],
    },
    deliveryPerson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Delivery log must be associated with a delivery person"],
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    customerName: {
      type: String,
      default: "Customer",
    },
    customerPhone: {
      type: String,
      default: "",
    },
    deliveryAddress: {
      type: String,
      default: "",
    },
    action: {
      type: String,
      required: [true, "Log action is required"],
      enum: [
        "Order Assigned",
        "Order Reassigned",
        "Picked Up",
        "Out For Delivery",
        "Delivered",
        "Failed Delivery",
        "COD Payment Collected",
      ],
    },
    status: {
      type: String,
      required: [true, "Log status is required"],
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const DeliveryLog = mongoose.model("DeliveryLog", deliveryLogSchema);
module.exports = DeliveryLog;
