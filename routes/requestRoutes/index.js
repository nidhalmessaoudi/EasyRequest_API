const router = require("express").Router();
const requestController = require("./controllers/requestController");
const userController = require("./controllers/userController");

router
  .route("/")
  .post(userController.attachUser, requestController.postRequest);

module.exports = router;
