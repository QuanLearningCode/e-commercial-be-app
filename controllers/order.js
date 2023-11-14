const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

const checkLogin = require("../utils/checkLogin");

exports.postOrder = (req, res, next) => {
  const {
    userId,
    fullName,
    email,
    phone,
    address,
    products,
    totalPrice,
    date,
    status,
  } = req.body;
  const transformedProducts = products.map((product) => {
    return {
      product: product.productId._id,
      quantity: product.quantity,
    };
  });
  const order = new Order({
    fullName: fullName,
    email: email,
    phone: phone,
    address: address,
    user: userId,
    products: transformedProducts,
    totalPrice: totalPrice,
    date: date,
    delivery: "Waiting for Progressing",
    status: status,
  });
  order.save();
  transformedProducts.forEach((product) => {
    Product.findOne({ _id: product.product })
      .then((prod) => {
        const newQuantity = prod.quantity - product.quantity;
        prod.quantity = newQuantity;
        prod.save();
      })
      .catch((err) => console.log(err));
  });
  User.findOne({ _id: userId })
    .then((user) => {
      user.cart.items = [];
      user.save();
      return res.status(200).end();
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatus = 500;
      return next(error);
    });
};

exports.getOrder = (req, res, next) => {
  const userLogin = checkLogin(req.session.user);
  Order.find({ user: userLogin.userId })
    .then((orders) => {
      if (orders.length === 0) {
        return res.status(200).json([]);
      }
      return res.status(200).json(orders);
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatus = 500;
      return next(error);
    });
};

exports.getDetailOrder = async (req, res, next) => {
  const orderId = req.params.orderId;
  try {
    const order = await Order.findOne({ _id: orderId });
    const getProducts = await Promise.all(
      order.products.map(async (prod) => {
        const product = await Product.findOne({ _id: prod.product });
        return {
          product: product,
          quantity: prod.quantity,
        };
      })
    );
    const resOrderData = {
      userId: order.user,
      orderId: order._id,
      fullName: order.fullName,
      phone: order.phone,
      address: order.address,
      total: order.totalPrice,
      products: getProducts,
    };
    res.status(200).json(resOrderData);
  } catch (err) {
    const error = new Error(err);
    error.httpStatus = 500;
    return next(error);
  }
};
