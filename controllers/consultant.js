const Chat = require("../models/Chat");

exports.getConversation = async (req, res, next) => {
  try {
    const chats = await Chat.find();
    return res.status(200).json(chats);
  } catch (err) {
    const error = new Error(err);
    error.httpStatus = 500;
    return next(err);
  }
};

exports.getDetailConversation = async (req, res, next) => {
  const chatId = req.params.chatId;
  try {
    const chat = await Chat.findOne({ chatId: chatId });
    return res.status(200).json(chat);
  } catch (err) {
    const error = new Error(err);
    error.httpStatus = 500;
    return next(err);
  }
};
