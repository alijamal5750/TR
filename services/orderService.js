const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const factroy=require('./handlersFactory');
const asyncHandler=require('express-async-handler');
const ApiError = require("../utils/apiError");
const stripe=require('stripe')(process.env.STRIPE_SECRET_KEY);

// @desc create cash order
// @route POST /api/v1/orders/cartId(single cartItem in careItems to get product info)
// @access protected user 
exports.createCashOrder=asyncHandler(async(req,res,next)=>{
    // app settings (admin) : add a model that carry both and get it by query (later) :
    const taxPrice=0;
    const shippingPrice=0;
// 1- get Cart depend on cartId : 
const cart=await Cart.findById(req.params.cartId);
if(!cart){
    return next(new ApiError('there is no cart with this cartId',404));
}
// 2- get order price depend on cartPrice (check if coupon applied) :
const cartPrice=cart.totalPriceAfterDiscount // if cart has discount (coupon applied !) :  
? cart.totalPriceAfterDiscount
:cart.totalCartPrice;   // if cart has not discount

const totalOrderPrice=cartPrice+ taxPrice + shippingPrice;
// 3- create order with defualt paymnet method(cash) :
const order=await Order.create({
    user:req.user._id,
    cartItems:cart.cartItems,
    shippingAddress:req.body.shippingAddress,
    totalOrderPrice,
});
// 4- after creating order, decrement product quantity and incremant product sold in (product Mdoel) : bulkWrite to do multiple oprations in single command (filteration,update) :  
if(order){
    const bulkOption=cart.cartItems.map(item=>({
        updateOne:{
            filter:{_id:item.product},
            update:{$inc:{quantity:-item.quantity,sold:+item.quantity}}
        }
        }));
        await Product.bulkWrite(bulkOption,{});

        // 5- clear Cart depend on CartId in params : 
        await Cart.findByIdAndDelete(req.params.cartId);
}

res.status(201).json({status:'Success',data:order});
});

// filterObj for findAllOrders : 
exports.filterOrdersForLoggedUser=asyncHandler(async(req,res,next)=>{
// if logged user rile is 'user' get only orders that blong to him : if role (admin,manager) get all orders for them :
if(req.user.role == 'user')req.filterObj={user:req.user._id};
next();
});

// @desc get all Orders
// @route POST /api/v1/order
// @access protected (admin,manager)
exports.findAllOrders=factroy.getAll(Order);

// @desc get sp order
// @route POST /api/v1/order/:id
// @access protected (admin,manager,user)
exports.findSpeificOrder=factroy.getOne(Order);

// @desc update order Delivered status 
// @route put /api/v1/order/:id/Delivered
// @access protected (admin,manager)
exports.updateorderPaid=asyncHandler(async(req,res,next)=>{
const order=await Order.findById(req.params.id);
if(!order){
    return next(new ApiError(`there is no order for this id: ${req.params.id}`,404));
}
// update order to paid : 
order.isPaid=true;
order.paidAt=Date.now();

const updatedOrder=await order.save();
res.status(200).json({status:'Success',data:updatedOrder});

});

// @desc update order paid status paid
// @route put /api/v1/order/:id/pay
// @access protected (admin,manager)
exports.updateorderToDelivered=asyncHandler(async(req,res,next)=>{
    const order=await Order.findById(req.params.id);
    if(!order){
        return next(new ApiError(`there is no order for this id: ${req.params.id}`,404));
    }
    // update order to paid : 
    order.isDeliverd=true;
    order.deliverdAt=Date.now();
    
    const updatedOrder=await order.save();
    res.status(200).json({status:'Success',data:updatedOrder});
    
});

// @desc get checkout session from stripe and send it as response 
// @route Get /api/v1/order/checkoutSession/cartId (to send price of the order to strpe)
// @access protected (user)
exports.checkoutSession=asyncHandler(async(req,res,next)=>{
    const taxPrice=0;
    const shippingPrice=0;
    const cart=await Cart.findById(req.params.cartId);
    if(!cart){
        return next(new ApiError(`there is no order for this id: ${req.params.cartId}`,404));
    }
    const cartPrice=cart.totalPriceAfterDiscount  
    ? cart.totalPriceAfterDiscount
    :cart.totalCartPrice; 

    const totalOrderPrice=cartPrice+taxPrice+shippingPrice;
    
    // create stripe checkout session : 
const session=await stripe.checkout.sessions.create({
    line_items:[ 
        {
        price_data:{
        unit_amount:totalOrderPrice * 100,
        currency:'usd',
        product_data:{
        name:req.user.name,
        },
    },
    quantity:1,
    }
    ],
mode:'payment',
success_url: `${req.protocol}://${req.get('host')}/order`,
cancel_url: `${req.protocol}://${req.get('host')}/cart`,
customer_email:req.user.email,
client_reference_id:req.params.cartId,// or cart._id to get cartId after paymnet done in stripe to create order in our sytem
metadata:req.body.shippingAddress,
});
// send session to responce : 
res.status(200).json({status:'success',session});
});

// for webhook after paymnet is paid : 
const createCartOrder=async(session)=>{
const cartId=session.client_reference_id;
const shippingAddress=session.metadata;
const orderPrice=session.amount_total /100;
const cart=await Cart.findById(cartId);
const user=await User.findOne({email:session.customer_email});

// create order : 
const order=await Order.create({
    user:user._id,
    cartItems:cart.cartItems,
    shippingAddress:shippingAddress,
    totalOrderPrice:orderPrice,
    isPaid:true,
    paidAt:Date.now(),
    paymentMethodTypes:'cart',
});
if(order){
    const bulkOption=cart.cartItems.map(item=>({
        updateOne:{
            filter:{_id:item.product},
            update:{$inc:{quantity:-item.quantity,sold:+item.quantity}}
        }
        }));
        await Product.bulkWrite(bulkOption,{});

        // 5- clear Cart depend on CartId in params : 
        await Cart.findByIdAndDelete(cartId);
}
};

// this webhook will run when stripe payment successfully paid : 
exports.webhookcheckout=asyncHandler(async(req,res,next)=>{
const slg=req.params.headers('stripe-signture');

let event;

try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }
  if(event.type=='checkout.session.completed'){
    // create order 
    createCartOrder(event.data.object);
  }
  res.status(201).json({received:true});

});