const User = require("../../models/User/index");

async function findUser(ip, getIt) {
  const user = await User.find({ ip });
  if (user) {
    return getIt ? user : null;
  } else {
    return getIt ? true : false;
  }
}

async function createUser(user) {
  return await User.create(user);
}

exports.attachUser = async (req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const userIsFound = await findUser(ip, false);
  req.body.user = ip;
  if (userIsFound) {
    next();
  }
  await createUser({ ip });
  next();
};
