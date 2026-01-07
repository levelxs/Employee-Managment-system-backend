const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const { register, login, logout, home, forgotPassword, resetPassword, } = require("../controllers/auth.controller");

//Auth Routes
router.post("/register", register)
router.post("/login", login);
router.post("/logout", logout);
router.get("/home", authMiddleware, home);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);



module.exports = router;
