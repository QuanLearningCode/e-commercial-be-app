const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  fullName: { type: String },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  products: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number },
    },
  ],
  totalPrice: { type: Number },
  date: { type: Date },
  delivery: { type: String },
  status: { type: String },
});

module.exports = mongoose.model("Order", orderSchema);
