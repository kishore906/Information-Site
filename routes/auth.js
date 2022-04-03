const express = require("express");
const authController = require("../controllers/auth");

const router = express.Router();

router.post("/registration", authController.registration);

router.post("/login", authController.login);

router.get("/logout", authController.logout);

router.post("/changepassword", authController.changePassword);

router.post("/search_colleges", authController.search_colleges);

router.get("/collegeinfo/:id", authController.collegeInfo);

//router.get("/addlist/:id", authController.addlist);

//router.post("/collegeinfo", authController.collegeAddList);

//router.get("/addlist", authController.displayList);

module.exports = router;
