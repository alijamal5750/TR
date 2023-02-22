const express = require('express');

const{addAddress,deleteAddress,getLoggedUserAddress,updateAddress}
 = require('../services/addressService');

/* const { getBrandValidator,createBrandValidator,updateBrandValidator,deleteBrandValidator }
 = require('../utils/validators/brandValidators');
 */
 const authService=require('../services/authService');

const router=express.Router();

router.route('/').get(authService.protect,authService.allowedTo('user')
,getLoggedUserAddress);

router.route('/').post(authService.protect,authService.allowedTo('user')
,addAddress);

router.route('/:addressId').delete(authService.protect,authService.allowedTo('user')
,deleteAddress);

router.route('/:addressId').put(authService.protect,authService.allowedTo('user')
,updateAddress);

module.exports=router;