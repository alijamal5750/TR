const express = require('express');
const{createCashOrder,findAllOrders,findSpeificOrder,
    filterOrdersForLoggedUser,updateorderPaid,updateorderToDelivered,checkoutSession}
 = require('../services/orderService');
const authService=require('../services/authService');

const router=express.Router();
router.route('/:cartId').post(authService.protect,authService.allowedTo('user'),createCashOrder);
router.route('/checkout_session/:cartId').get(authService.protect,authService.allowedTo('user'),checkoutSession);
router.route('/').get(authService.protect,authService.allowedTo('admin','manager','user'),filterOrdersForLoggedUser,findAllOrders);
router.route('/:id').get(authService.protect,authService.allowedTo('admin','manager','user'),findSpeificOrder);
router.route('/:id/pay').put(authService.protect,authService.allowedTo('admin','manager'),updateorderPaid);
router.route('/:id/deliver').put(authService.protect,authService.allowedTo('admin','manager'),updateorderToDelivered);

module.exports=router;