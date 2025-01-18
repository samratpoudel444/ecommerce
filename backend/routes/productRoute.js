const express= require("express");
const controllers= require("../controllers.js/productController");

const router= express.Router();


router.route('/featured-products').get(controllers.getFeaturedProduct);
router.route('/products').get(controllers.getOneProduct)
router.route('/getProducts').get(controllers.getProductByCategory)
module.exports= router;