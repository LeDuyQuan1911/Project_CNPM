const SECRET_KEY = process.env.JWT_SECRET || '2FxXT1NTf2K1Mo4i6AOvtdI';
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const ErrorHandler = require("../utils/ErrorHandler");

const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  const decodedData = jwt.verify(token, SECRET_KEY);
  req.user = await User.findById(decodedData.id);

  next();
};

const isAdmin = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return next(new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`, 403));
  }
  next();
};

module.exports = { isAuthenticated, isAdmin };
