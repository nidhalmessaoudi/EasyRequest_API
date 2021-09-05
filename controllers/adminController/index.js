const passport = require("passport");

const Request = require("../../models/Request/index");

exports.checkIfAuthenticated = function (req, res, next) {
  const path = req.path;
  if (!req.isAuthenticated()) {
    path === "/login" ? next() : res.redirect("/admin/login");
    return;
  }
  path === "/login" ? res.redirect("/admin/dashboard") : next();
};

exports.getAdmin = function (req, res) {
  return res.redirect("/admin/login");
};

exports.getLogin = function (req, res) {
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

exports.getDashboard = async function (req, res) {
  const requests = await getRequests(10);

  const stats = {
    totalRequests: await Request.countDocuments(),
    successfulRequests: await Request.countDocuments({ isSuccessful: true }),
    failedRequests: await Request.countDocuments({ isSuccessful: false }),
  };

  res.render("dashboard", {
    title: "Admin Dashboard | Easy Request",
    requests,
    stats,
  });
};

exports.getRequest = async function (req, res) {
  try {
    const requestId = req.params.id;

    if (!requestId) {
      throw new Error();
    }

    const requestObj = await Request.findById(requestId).lean();

    if (!requestObj) {
      throw new Error();
    }
    let request = {};
    for (prop in requestObj) {
      switch (prop) {
        case "user":
          request[prop] = {
            id: requestObj[prop]._id,
            ip: requestObj[prop].ip,
          };
          continue;
        case "createdAt":
          request[prop] = getDate(requestObj[prop].toISOString());
          continue;
        case "responseTime":
          request[prop] = `${requestObj[prop]}ms`;
          continue;
        case "responseSize":
          request[prop] = `${requestObj[prop]}kb`;
          continue;
        case "message":
          request[prop] = cleanHTMLStr(String(requestObj[prop]));
          continue;
        case "updatedAt":
        case "id":
        case "__v":
          continue;
      }
      request[prop] = requestObj[prop];
    }

    res.render("request", {
      title: "Admin Dashboard | Easy Request",
      request,
      error: undefined,
    });
  } catch (err) {
    console.log(err);
    const error = "No request was found with this id!";
    res.render("request", {
      title: "Admin Dashboard | Easy Request",
      request: undefined,
      error,
    });
  }
};

async function getRequests(nRequests) {
  return await Request.find().limit(nRequests);
}

function getDate(dateStr) {
  const date = new Date(dateStr);
  return `${date.getDay() + 1}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

function cleanHTMLStr(str) {
  // Remove line breaks
  let newStr = str.replace(/\r?\n|\r/g, "");

  // Remove html sanitization for anchor tags
  newStr = newStr.replace(/&lt;a/g, "<a");
  newStr = newStr.replace(/&lt;\/a>/g, "</a>");

  // Get the anchor tag and its content
  const htmlAnchorRegex = new RegExp(/<a[^>]*>([^<]+)<\/a>/g);
  const regexResult = htmlAnchorRegex.exec(newStr);

  if (!regexResult) {
    return newStr;
  }
  return newStr.replace(regexResult[0], regexResult[1].trim());
}
