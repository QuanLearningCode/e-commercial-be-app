const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const productSchema = new Schema({
  name: { type: String },
  category: { type: String },
  price: { type: Number },
  long_desc: { type: String },
  short_desc: { type: String },
  img1: { type: String },
  img2: { type: String },
  img3: { type: String },
  img4: { type: String },
  quantity: { type: Number },
  // userId: {
  //   type: Schema.Types.ObjectId,
  //   ref: "User",
  // },
});

module.exports = mongoose.model("Product", productSchema);
