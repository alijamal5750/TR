const express = require('express');

const{getCoupons,getCoupon,createCoupon,updateCoupon,deleteCoupon}
 = require('../services/couponService');

 const authService=require('../services/authService');

const router=express.Router();


router.route('/').get(authService.protect,authService.allowedTo('admin','manager'),getCoupons).post(authService.protect,authService.allowedTo('admin','manager')
,createCoupon);
router.route('/:id').get(authService.protect,authService.allowedTo('admin','manager'),getCoupon)
    .put(authService.protect,authService.allowedTo('admin','manager')
    ,updateCoupon).delete(authService.protect,authService.allowedTo('admin','manager')
    ,deleteCoupon);

module.exports=router;