const passport = require("passport");

const Admin = require("../../models/Admin/index");

module.exports = function () {
  passport.use(Admin.createStrategy());
  passport.serializeUser(Admin.serializeUser());
  passport.deserializeUser(Admin.deserializeUser());
};
