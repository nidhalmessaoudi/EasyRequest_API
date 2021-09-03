const router = require("express").Router();

const adminController = require("../../controllers/adminController/index");

router.get("/", adminController.getAdmin);

router
  .route("/login")
  .get(adminController.getLogin)
  .post(adminController.postLogin);

router.get("/dashboard", adminController.getDashboard);

module.exports = router;
