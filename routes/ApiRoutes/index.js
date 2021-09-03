const router = require("express").Router();
const requestController = require("../../controllers/requestController/index");
const userController = require("../../controllers/userController/index");

router
  .route("/requests")
  .post(userController.attachUser, requestController.postRequest);

router.use(function (req, res) {
  res.status(404).json({
    status: "fail",
    message: `Cannot find ${req.path} on this server`,
  });
});

module.exports = router;
