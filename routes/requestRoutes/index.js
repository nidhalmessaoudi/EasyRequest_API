const router = require("express").Router();
const requestController = require("../../controllers/requestController/index");
const userController = require("../../controllers/userController/index");

router
  .route("/")
  .post(userController.attachUser, requestController.postRequest);

module.exports = router;
