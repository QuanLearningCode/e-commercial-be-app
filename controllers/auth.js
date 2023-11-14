const bcrypt = require("bcryptjs");

const User = require("../models/User");
const checkLogin = require("../utils/checkLogin");

exports.postRegister = async (req, res, next) => {
  const { fullName, email, password, phone } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (user) {
      return res
        .status(400)
        .json([{ msg: "Existing email. Please choose a different one" }]);
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      fullName: fullName,
      email: email,
      password: hashedPassword,
      phone: phone,
      cart: { items: [] },
      authority: "Client",
    });
    newUser.save();
    return res.status(200).end();
  } catch (err) {
    const error = new Error(err);
    error.httpStatus = 500;
    return next(error);
  }
};

exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json([{ msg: "Wrong Email" }]);
    }
    const isMatchPassword = bcrypt.compareSync(password, user.password);
    if (!isMatchPassword) {
      return res.status(400).json([{ msg: "Wrong Password" }]);
    }
    req.session.isLoggedIn = true;
    req.session.user = user;
    req.session.save();
    res.status(200).end();
  } catch (err) {
    const error = new Error(err);
    error.httpStatus = 500;
    return next(error);
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

exports.checkSession = (req, res, next) => {
  const result = checkLogin(req.session.user);
  return res.status(200).json(result);
};
