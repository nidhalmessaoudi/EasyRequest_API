require("dotenv").config();
const mongoose = require("mongoose");

const app = require("./app");

(function init() {
  mongoose
    .connect(process.env.DB_HOST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(function () {
      console.log("Connected to DB!");
      const PORT = process.env.PORT || 8000;
      app.listen(PORT, function () { console.log(`Server started at port ${PORT}`); });
    })
    .catch(function (err) { console.log(err); });
})();
