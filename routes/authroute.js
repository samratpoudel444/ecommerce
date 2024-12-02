const express= require("express");
const controllers = require("../controllers/authcontrollers");
const router= express.Router();

router.route('/signUp').post(controllers.signUpUsers);

module.exports= router;