const passport = require("passport");

exports.getAdmin = function (req, res) {
  return res.redirect("/admin/login");
};

exports.getLogin = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/admin/dashboard");
  }

  const errorFlash = req.flash("error");

  res.render("login", {
    title: "Admin Login | Easy Request",
    error: errorFlash.length > 0 ? errorFlash[0] : undefined,
  });
};

exports.postLogin = passport.authenticate("local", {
  failureRedirect: "/admin/login",
  successRedirect: "/admin/dashboard",
  failureFlash: true,
});

exports.getDashboard = function (req, res) {
  if (!req.isAuthenticated()) {
    return res.redirect("/admin/login");
  }
  res.render("dashboard", {
    title: "Admin Dashboard | Easy Request",
  });
};
