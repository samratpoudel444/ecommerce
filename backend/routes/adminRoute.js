const express= require("express");
const controllers = require("../controllers.js/adminController");
const router= express.Router();


router.route("/addProduct").post(controllers.addProduct);

router.route("/showProduct").get(controllers.showAllProduct);
router.route("/deleteProduct").delete(controllers.deleteProduct);
module.exports= router;