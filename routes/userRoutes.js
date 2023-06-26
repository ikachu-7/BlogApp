const express = require("express");
const {
  Register,
  Login,
  RegisterController,
  LoginController,
  LogoutController,
} = require("../controllers/UserController");

const router = express.Router();

router.get("/register", Register);
router.get("/login", Login);

router.post("/register", RegisterController);
router.post("/login", LoginController);
router.get("/logout", LogoutController);


module.exports = router;
