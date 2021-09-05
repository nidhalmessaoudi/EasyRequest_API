const router = require("express").Router();

const adminController = require("../../controllers/adminController/index");

router.get("/", adminController.getAdmin);

router
  .route("/login")
  .get(adminController.checkIfAuthenticated, adminController.getLogin)
  .post(adminController.postLogin);

router.use(adminController.checkIfAuthenticated);

router.get("/dashboard", adminController.getDashboard);

router.get("/dashboard/requests/:id", adminController.getRequest);

module.exports = router;
