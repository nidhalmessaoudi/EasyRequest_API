const path = require("path");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const flash = require("connect-flash");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const ApiRoutes = require("./routes/ApiRoutes/index.js");
const adminRoutes = require("./routes/adminRoutes");

const auth = require("./controllers/authController/index");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");

const client = process.env.CLIENT;

app.use(
  cors({
    origin: client,
  })
);

app.use(helmet());

app.use(express.json({ limit: "5kb" }));
app.use(
  express.urlencoded({
    extended: false,
    limit: "3kb",
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: process.env.SESSION_EXPIRES * 24 * 60 * 60 * 1000,
      secure: process.env.MODE === "production" ? true : false,
    },
  })
);

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

auth(passport);

app.use(mongoSanitize());

app.use(xss());

app.use(hpp());

app.get("/", function (req, res) {
  res.redirect(client);
});

// API routes
app.use("/api/v1", ApiRoutes);

// Admin routes
app.use("/admin", adminRoutes);

// Not found
app.use(function (req, res) {
  res.status(404).render("notFound", {
    title: "Page Not Found",
    loggedIn: req.isAuthenticated() ? true : false,
  });
});

module.exports = app;
