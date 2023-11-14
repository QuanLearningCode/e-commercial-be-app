const Product = require("../models/Product");
const User = require("../models/User");
const checkLogin = require("../utils/checkLogin");

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      if (products.length !== 0) {
        res.status(200).json(products);
      } else {
        res.status(404).json({
          message: "Products not Found",
        });
      }
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatus = 500;
      return next(error);
    });
};

exports.getDetailProduct = (req, res, next) => {
  const productId = req.params.productId;
  const result = checkLogin(req.session.user);
  // console.log(result);
  Product.findOne({ _id: productId })
    .then((product) => {
      const resData = {
        userLogin: result,
        product: product,
      };
      res.status(200).json(resData);
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatus = 500;
      return next(error);
    });
};

exports.postCart = async (req, res, next) => {
  const { productId, quantity } = req.body;
  const userLogin = checkLogin(req.session.user);
  try {
    const product = await Product.findOne({ _id: productId });
    const user = await User.findOne({ _id: userLogin.userId });
    const existingProduct = user.cart.items.findIndex(
      (product) => product.productId.toString() === productId
    );

    if (existingProduct >= 0) {
      user.cart.items[existingProduct].quantity =
        user.cart.items[existingProduct].quantity + Number(quantity);
      user.save();
      return res.status(200).end();
    }
    user.cart.items.push({ productId: product, quantity: Number(quantity) });
    user.save();
    return res.status(200).end();
  } catch (err) {
    const error = new Error(err);
    error.httpStatus = 500;
    return next(error);
  }
};

exports.getCart = async (req, res, next) => {
  const userLogin = checkLogin(req.session.user);
  if (!userLogin) {
    return res.status(200).json({ userLogin: null });
  }
  try {
    const user = await User.findOne({ _id: userLogin.userId });
    const getProducts = await user.populate("cart.items.productId");
    const productsInCart = getProducts.cart.items;
    const resData = {
      userLogin: userLogin,
      cart: productsInCart,
    };
    res.status(200).json(resData);
  } catch (err) {
    const error = new Error(err);
    error.httpStatus = 500;
    return next(error);
  }
};

exports.postUpdateCart = async (req, res, next) => {
  const { updatedCart } = req.body;
  const userLogin = checkLogin(req.session.user);
  try {
    const user = await User.findOne({ _id: userLogin.userId });
    user.cart.items = updatedCart;
    user.save();
    res.status(200).end();
  } catch (err) {
    const error = new Error(err);
    error.httpStatus = 500;
    return next(error);
  }
};

exports.postDeleteProductFromCart = async (req, res, next) => {
  const productId = req.params.productId;
  const userLogin = checkLogin(req.session.user);
  try {
    const user = await User.findOne({ _id: userLogin.userId });
    const updatedCart = user.cart.items.filter(
      (product) => product.productId.toString() !== productId
    );
    user.cart.items = updatedCart;
    user.save();
    return res.status(200).json(updatedCart);
  } catch (err) {
    const error = new Error(err);
    error.httpStatus = 500;
    return next(error);
  }
};
