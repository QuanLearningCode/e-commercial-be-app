const express = require("express");

const adminControllers = require("../controllers/admin");

const router = express.Router();

router.post("/admin/register", adminControllers.postRegister);
router.post("/admin/login", adminControllers.postLogin);
router.get("/admin/logout", adminControllers.getLogout);

router.get("/admin/products", adminControllers.getProducts);

router.get("/admin/orders", adminControllers.getOrders);

router.post("/admin/add-product", adminControllers.postNewProduct);
router.post("/admin/edit-product/:productId", adminControllers.postEditProduct);
router.get("/admin/edit-product/:productId", adminControllers.getEditProduct);
router.delete(
  "/admin/delete-product/:productId",
  adminControllers.deleteProduct
);

module.exports = router;
