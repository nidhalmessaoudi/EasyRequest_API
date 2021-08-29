const express = require("express");
const cors = require("cors");

const requestRoutes = require("./routes/requestRoutes/index.js");

const app = express();

const client = process.env.CLIENT;

app.use(cors({
    origin: client
}));

app.use(express.json({ limit: "5kb" }));

app.get("/", function (req, res) {
  res.redirect(client);
});

app.use("/api/v1/requests", requestRoutes);

app.use(function (req, res) {
  res.status(404).json({
   status: "fail",
   message: `Cannot find ${req.path} on this server`
  });
});

module.exports = app;
