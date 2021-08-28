const express = require("express");

const requestRoutes = require("./routes/requestRoutes/index.js");

const app = express();

app.use(express.json({ limit: "5kb" }));

app.get("/", (req, res) => {
  res.redirect("https://easyrequest.netlify.app");
});

app.use("/api/v1/requests", requestRoutes);

module.exports = app;
