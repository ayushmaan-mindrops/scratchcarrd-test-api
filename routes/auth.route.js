const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload.middleware");
const authController = require("../controllers/auth.controller");
const auth = require("../middlewares/auth.middleware");

router.post("/auth/register", upload.single("img"), authController.createUser);

router.post("/auth/login", authController.login);

router.get("/validate_trader/:id", authController.validateTrader);

router.post("/email", auth, authController.email);

module.exports = router;
