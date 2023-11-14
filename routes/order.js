const express = require("express");
const orderControllers = require("../controllers/order");

const router = express.Router();

router.post("/orders/add-order", orderControllers.postOrder);
router.get("/orders", orderControllers.getOrder);
router.get("/orders/order/:orderId", orderControllers.getDetailOrder);

module.exports = router;
