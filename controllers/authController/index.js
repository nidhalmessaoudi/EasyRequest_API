const Admin = require("../../models/Admin/index");

module.exports = function (passport) {
  passport.use(Admin.createStrategy());
  passport.serializeUser(Admin.serializeUser());
  passport.deserializeUser(Admin.deserializeUser());
};
