const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    sessionId: {
      type: String,
      default: "guest",
    },
    items: [
      {
        id: String,
        title: String,
        price: Number,
        quantity: { type: Number, default: 1 },
        image: String,
        calories: Number,
        time: String,
        difficulty: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
