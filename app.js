const express = require("express");
const cors = require("cors");

const requestRoutes = require("./routes/requestRoutes/index.js");

const app = express();

const client = process.env.CLIENT;

app.use(cors({
    origin: client
}));

app.use(express.json({ limit: "5kb" }));

app.get("/", (req, res) => {
  res.redirect(client);
});

app.use("/api/v1/requests", requestRoutes);

module.exports = app;
