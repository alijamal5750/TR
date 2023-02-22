const express = require('express');

const{addProductToCart,getLoggedUserCart
    ,removeSpeicifCartItem,clearCart,updateCartItemQuantity,applyCoupon,test}
 = require('../services/cartService');


 const authService=require('../services/authService');

const router=express.Router();

router.route('/').post(authService.protect,authService.allowedTo('user')
,addProductToCart).delete(authService.protect,authService.allowedTo('user')
,clearCart);

router.route('/').get(authService.protect,authService.allowedTo('user')
,getLoggedUserCart);

router.route('/test').get(authService.protect,authService.allowedTo('user')
,test);

router.route('/:itemId').delete(authService.protect,authService.allowedTo('user')
,removeSpeicifCartItem);

router.route('/applycoupon').put(authService.protect,authService.allowedTo('user')
,applyCoupon);

router.route('/:itemId').put(authService.protect,authService.allowedTo('user')
,updateCartItemQuantity);

module.exports=router;