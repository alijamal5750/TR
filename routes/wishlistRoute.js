const express = require('express');

const{addProductToWishlist,deleteProductToWishlist,getLoggedUserWishlist}
 = require('../services/wishlistService');

/* const { getBrandValidator,createBrandValidator,updateBrandValidator,deleteBrandValidator }
 = require('../utils/validators/brandValidators');
 */
 const authService=require('../services/authService');

const router=express.Router();

router.route('/').get(authService.protect,authService.allowedTo('user')
,getLoggedUserWishlist);

router.route('/').post(authService.protect,authService.allowedTo('user')
,addProductToWishlist);

router.route('/:productId').delete(authService.protect,authService.allowedTo('user')
,deleteProductToWishlist);

module.exports=router;