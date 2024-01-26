const express = require("express");
const userController = require("./../controllers/User");
const router = express.Router();
const passport = require("passport");
require("./../midleware/passport")(passport);
const Authenticate = passport.authenticate("jwt", { session: false })

router.post("/registration", userController.userRegister);
router.post("/login", userController.userLog);
router.put("/changeAvatar",Authenticate ,userController.userMakeAva)
router.get("/userinfo",Authenticate ,userController.getUser)
router.get("/getMe",Authenticate ,userController.getMe)


module.exports = router;

// userRegister
// userLog
