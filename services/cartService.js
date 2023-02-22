const Cart= require("../models/cartModel");
const Coupon= require("../models/couponModel");
const factroy=require('./handlersFactory');
const asyncHandler=require('express-async-handler');
const Product=require('../models/productModel');
const ApiError = require("../utils/apiError");

const calcTotalCartPrice=(cart)=>{
    let totalPrice=0;

    cart.cartItems.forEach((item)=>{
    totalPrice +=item.price * item.quantity;
    });
    // assigned total to cart : 
    cart.totalCartPrice=totalPrice;
    // apply totalPriceAfterDiscount only when apply coupon
    cart.totalPriceAfterDiscount=undefined;
    return totalPrice;
};

// @disc add product to Cart
// @route POST /api/v1/cart
// @access protect/user
exports.addProductToCart=asyncHandler(async(req,res,next)=>{
// get product info : 
const{productId,color}=req.body;
// bring the price from database based on productId from body : 
const product=await Product.findById(productId);

// 1- get cart for logged user : 
let cart=await Cart.findOne({user:req.user._id});
if(!cart){
    // create cart for this logged user with product 
    cart=await Cart.create({
        user:req.user._id,
        cartItems:[{
            product:productId,
            // color is the same in model and in body so no need to (color:<C>olor) if the same :
            color,
            price:product.price,
        }],
    });
}
else{
    // 2- cart available with logged user : if product exist in cart with same color increase quantity
    // get the product in witch cartItem Index of CateItems Indexs
    const productIndex=cart.cartItems.findIndex(item=>item.product.toString()==productId && item.color ==color); 
    // > -1 found product index[0] 0 means found value,cuz cartItems is Array and first cartItem start with Index 0 ! Array in general start with index 0  
    if(productIndex>-1){
        // get cartItem from CartItems Array: then update quantity
        const cartItem=cart.cartItems[productIndex];
        cartItem.quantity +=1;
        // update the same product in the array with the same index and assigned the quantity for it : 
        cart.cartItems[productIndex]=cartItem;
    }
    // 3- if product is not exist in cart or exist but the color is deffrent so push product to cart : push 
    else{
        cart.cartItems.push({
            product:productId,
            color,
            price:product.price,
        });
    }
}

// calculate total cart price :
 calcTotalCartPrice(cart);
    
// save to db : 
    await cart.save();

    res.status(200).json({status:'success',message:'product added to cart successfuly',data:cart});

});

// @disc get user logged cart
// @route GEt /api/v1/cart
// @access protect/user
exports.getLoggedUserCart=asyncHandler(async(req,res,next)=>{
const cart=await Cart.findOne({user:req.user._id});
if(!cart){
    return next(new ApiError(`there is no cart to this user id: ${req.user._id}`,404));
}

res.status(200).json({status:'success',numOfCartItems:cart.cartItems.length,data:cart});

});

// @disc delete cartItem from cart.carteItems
// @route delete /api/v1/cart/:itemId
// @access protect/user
exports.removeSpeicifCartItem=asyncHandler(async(req,res,next)=>{
const cart =await Cart.findOneAndUpdate(
    {user:req.user._id},
    {
        $pull:{cartItems:{_id:req.params.itemId}},
    },
    {new:true},
    );

    calcTotalCartPrice(cart);

    cart.save();

    res.status(200).json({status:'success',numOfCartItems:cart.cartItems.length,data:cart});

});

// @disc clear cart of logged user
// @route delete /api/v1/cart
// @access protect/user
exports.clearCart=asyncHandler(async(req,res,next)=>{ 
await Cart.findOneAndDelete({user:req.user._id});
res.status(204).json();
});

// @disc update  spiecfic cartItem Quantity 
// @route put /api/v1/cart/:itemId
// @access protect/user
exports.updateCartItemQuantity=asyncHandler(async(req,res,next)=>{ 
    const cart=await Cart.findOne({user:req.user._id});
    const{quantity}=req.body;

    if(!cart){
        return next(new ApiError(`there is no cart to this user id: ${req.user._id}`,404));
    }

    // get CartItem index in cartItems Indexes by id of CartItem in params :
    const itemIndex=cart.cartItems.findIndex(item=>item._id.toString()==req.params.itemId);
    if(itemIndex >-1){ // Array start with index 0
        const cartItem=cart.cartItems[itemIndex];
        cartItem.quantity=quantity;
        cart.cartItems[itemIndex]=cartItem;
    }
    else{
        return next(new ApiError(`there is no item to this id: ${req.params.itemId}`,404));
    }

    calcTotalCartPrice(cart);

    await cart.save();

    res.status(200).json({status:'success',numOfCartItems:cart.cartItems.length,data:cart});
    });

 // @disc update  apply coupon on logged user cart
// @route put /api/v1/applyCoupon
// @access protect/user
exports.applyCoupon=asyncHandler(async(req,res,next)=>{
    // 1- get Coupon based on copuon name and expire date : 
    const coupon=await Coupon.findOne({name:req.body.coupon,expire:{$gt: Date.now()}});
    if(!coupon){
        return next(new ApiError(`Invalid Or Expire Coupon`,404));
    }

    // 2- get Logged user cart to get total cart price
    const cart=await Cart.findOne({user:req.user._id});

     const totalPrice=cart.totalCartPrice; //or 
    //const totalPrice=calcTotalCartPrice(cart);

    // 3- calculate price after discount : 
    const totalPriceAfterDiscount=(totalPrice - (totalPrice * coupon.discount) / 100).toFixed(2);// tofixed(2) for 99.22

    cart.totalPriceAfterDiscount=totalPriceAfterDiscount;

    await cart.save();
    res.status(200).json({status:'success',numOfCartItems:cart.cartItems.length,data:cart});
});

// for testing and understanding :
exports.test=asyncHandler(async(req,res,next)=>{
const cart=await Cart.findOne({user:req.user._id});
const index=cart.cartItems.findIndex(item=>item.product.toString()==req.body.product && item.color == req.body.color);
console.log(index);
});