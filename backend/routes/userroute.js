const express= require("express");
const controllers = require("../controllers.js/userController");
const router= express.Router();

router.route('/signUp').post(controllers.signUpUsers);
router.route('/signIn').post(controllers.signInUsers);
router.route('/otp').post(controllers.OTP);
router.route('/verifyOTP').post(controllers.verifyOTP);
router.route('/reset').post(controllers.resetPassword)
module.exports= router;