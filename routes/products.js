const express = require("express");
const productController = require("../controllers/products");
const router = express.Router();

router.get("/products", productController.getProducts);
router.get("/detail/:productId", productController.getDetailProduct);

router.post("/products/add-to-cart", productController.postCart);
router.get("/products/cart", productController.getCart);
router.post("/products/cart/update-cart", productController.postUpdateCart);
router.post(
  "/products/cart/delete-product/:productId",
  productController.postDeleteProductFromCart
);

module.exports = router;
