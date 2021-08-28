require("dotenv").config();
const mongoose = require("mongoose");

const app = require("./app");

(function init() {
  mongoose
    .connect(process.env.DB_HOST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to DB!");
      const PORT = process.env.PORT || 8000;
      app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
    })
    .catch((err) => console.log(err));
})();
