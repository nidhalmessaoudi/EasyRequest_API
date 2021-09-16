const passport = require("passport");
const ta = require("time-ago");

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
    loggedIn: false,
  });
};

exports.postLogin = passport.authenticate("local", {
  failureRedirect: "/admin/login",
  successRedirect: "/admin/dashboard",
  failureFlash: true,
});

exports.getDashboard = async function (req, res) {
  try {
    let page = +req.query.p || null;

    const stats = {
      totalRequests: await Request.countDocuments(),
      successfulRequests: await Request.countDocuments({ isSuccessful: true }),
      failedRequests: await Request.countDocuments({ isSuccessful: false }),
    };

    let availablePages = stats.totalRequests / 10;

    if (stats.totalRequests % 10 > 0) {
      availablePages++;
    }

    if (!page || page > availablePages || page <= 0) {
      res.redirect("/admin/dashboard?p=1");
      return;
    }

    const { skippedRequests, prevPage, nextPage } = paginateRequests(
      page,
      stats.totalRequests,
      res
    );

    const requests = await getRequests(10, skippedRequests);

    requests.forEach((request) => {
      request.since = ta.ago(request.createdAt);
    });

    res.render("dashboard", {
      title: "Admin Dashboard | Easy Request",
      requests,
      stats,
      prevPage,
      nextPage,
      loggedIn: true,
    });
  } catch (err) {
    console.error(err);
  }
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
          request[prop] = getDate(requestObj[prop]);
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
      loggedIn: true,
    });
  } catch (err) {
    console.log(err);
    const error = "No request was found with this id!";
    res.render("request", {
      title: "Admin Dashboard | Easy Request",
      request: undefined,
      error,
      loggedIn: true,
    });
  }
};

exports.getLogout = function (req, res) {
  req.logout();
  res.redirect("/admin/login");
};

async function getRequests(nRequests, skip) {
  return await Request.find().limit(nRequests).skip(skip).sort("createdAt");
}

function getDate(dateStr) {
  const date = new Date(dateStr);
  let month = "" + (date.getMonth() + 1);
  let day = "" + date.getDate();
  let year = date.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return `${[year, month, day].join("/")}, ${ta.ago(dateStr)}`;
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

function paginateRequests(page, total) {
  const skippedRequests = page > 1 ? (page - 1) * 10 : 0;
  const prevPage = page > 1 ? page - 1 : 0;
  const nextPage = skippedRequests + 10 < total ? page + 1 : 0;

  return {
    skippedRequests,
    prevPage,
    nextPage,
  };
}
