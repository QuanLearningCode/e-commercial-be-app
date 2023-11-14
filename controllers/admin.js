const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

const checkLogin = require("../utils/checkLogin");

exports.postRegister = async (req, res, next) => {
  const { fullName, email, password, role } = req.body;
  try {
    const user = await User.findOne({
      fullName: fullName,
      email: email,
      authority: role,
    });
    if (user) {
      return res.status(400).json([{ msg: "Existing Account" }]);
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      fullName: fullName,
      email: email,
      password: hashedPassword,
      cart: { items: [] },
      authority: role,
    });
    newUser.save();
    return res.status(200).end();
  } catch (err) {
    const error = new Error(err);
    error.httpStatus = 500;
    return next(err);
  }
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json([{ msg: "Wrong User" }]);
    }
    const isMatchPassword = bcrypt.compareSync(password, user.password);
    if (!isMatchPassword) {
      return res.status(400).json([{ msg: "Wrong Password" }]);
    }
    req.session.user = user;
    req.session.save();
    return res.status(200).json(user.authority);
  } catch (err) {
    const error = new Error(err);
    error.httpStatus = 500;
    return next(err);
  }
};

exports.getLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (!err) {
      return res.status(200).end();
    }
    const error = new Error(err);
    error.httpStatus = 500;
    return next(err);
  });
};

exports.getProducts = async (req, res, next) => {
  const userLogin = checkLogin(req.session.user);
  if (!userLogin) {
    return res.status(400).end();
  }
  try {
    const user = await User.findOne({ _id: userLogin.userId });
    if (user.authority === "Client" || user.authority === "Consultant") {
      return res.status(403).json(user.authority);
    }
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (err) {
    const error = new Error(err);
    error.httpStatus = 500;
    return next(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const clients = await User.find({ authority: "Client" });
    const orders = await Order.find();
    const resData = {
      clients: clients.length,
      orders: orders,
    };
    return res.status(200).json(resData);
  } catch (err) {
    const error = new Error(err);
    error.httpStatus = 500;
    return next(error);
  }
};

exports.postNewProduct = async (req, res, next) => {
  const { name, category, quantity, price, shortDesc, longDesc } = req.body;
  const uploadImages = req.files;
  try {
    const newProduct = new Product({
      name: name,
      category: category,
      price: price,
      long_desc: longDesc,
      short_desc: shortDesc,
      img1: uploadImages[0].originalname,
      img2: uploadImages[1].originalname,
      img3: uploadImages[2].originalname,
      img4: uploadImages[3].originalname,
      quantity: quantity,
    });
    newProduct.save();
    return res.status(200).end();
  } catch (err) {
    const error = new Error(err);
    error.httpStatus = 500;
    return next(error);
  }
};

exports.getEditProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findOne({ _id: productId })
    .then((product) => {
      return res.status(200).json(product);
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatus = 500;
      return next(error);
    });
};

exports.postEditProduct = async (req, res, next) => {
  const productId = req.params.productId;
  const { name, category, quantity, price, shortDesc, longDesc } = req.body;
  try {
    await Product.findByIdAndUpdate(productId, {
      name: name,
      category: category,
      price: price,
      long_desc: longDesc,
      short_desc: shortDesc,
      quantity: quantity,
    });
    return res.status(200).end();
  } catch (err) {
    const error = new Error(err);
    error.httpStatus = 500;
    return next(error);
  }
};

exports.deleteProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findByIdAndDelete(productId)
    .then((result) => {
      console.log("Successful Deleting");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatus = 500;
      return next(error);
    });
};
