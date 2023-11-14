const checkLogin = (user) => {
  if (user) {
    const userLogin = {
      userId: user._id,
      fullName: user.fullName,
      email: user.email,
    };
    return userLogin;
  }
  return null;
};

module.exports = checkLogin;
