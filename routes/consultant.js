const express = require("express");

const chatControllers = require("../controllers/consultant");

const router = express.Router();

router.get("/consultant/chat/", chatControllers.getConversation);
router.get("/consultant/chat/:chatId", chatControllers.getDetailConversation);

module.exports = router;
