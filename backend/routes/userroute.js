const express= require("express");
const controllers = require("../controllers.js/userController");
const router= express.Router();

router.route('/signUp').post(controllers.signUpUsers);
router.route('/signIn').post(controllers.signInUsers);

module.exports= router;