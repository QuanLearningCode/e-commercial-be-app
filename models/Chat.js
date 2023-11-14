const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema({
  chatId: { type: String },
  conversation: { type: Array },
});

module.exports = mongoose.model("Chat", chatSchema);
