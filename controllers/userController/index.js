const User = require("../../models/User/index");

async function findUser(ip) {
  return await User.findOne({ ip });
}

async function createUser(user) {
  return await User.create(user);
}

exports.attachUser = async function (req, res, next) {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const userIsFound = await findUser(ip);
  if (userIsFound) {
    req.body.user = userIsFound._id;
  } else {
    const user = await createUser({ ip });
    req.body.user = user._id;
  }
  next();
};
