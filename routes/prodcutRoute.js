const express = require('express');

const{getProducts,createProduct,getProduct,updateProduct,deleteProduct,uploadProductImages,resizeProductImages}
 = require('../services/productService');

const { getProductValidator,createProductValidator,updateProductValidator,deleteProductValidator }
 = require('../utils/validators/productValidator');

 const authService=require('../services/authService');

 const reviewsRoute=require('./reviewRoute');

const router=express.Router();

// nested route : Post /products/pekafdsjoj(productId)/reviews (create review with this product)
// nested route : Get /products/pekafdsjoj(productId)/reviews (Get reviews on this product)
// also we can use this nested route in postman : /products/pekafdsjoj(productId)/reviews/djajd(reviewId) to access speicif review on that product
// final addd param in review router to access parameters from another routes :
router.use('/:productId/reviews',reviewsRoute);


router.route('/').get(getProducts).post(authService.protect,authService.allowedTo('admin','manager')
,uploadProductImages,resizeProductImages,createProductValidator,createProduct);
router.route('/:id').get(getProductValidator,getProduct)
    .put(authService.protect,authService.allowedTo('admin','manager')
    ,uploadProductImages,resizeProductImages,updateProductValidator,updateProduct).delete(authService.protect,authService.allowedTo('admin')
    ,deleteProductValidator,deleteProduct);

module.exports=router;