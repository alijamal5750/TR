const User = require("../models/userModel");
const asyncHandler=require('express-async-handler');


// @disc add product to wishlist
// @route Post /api/v1/wishlist
// @access private (potect logged user)
exports.addProductToWishlist=asyncHandler(async(req,res,next)=>{
// add value to array in mongodb :
const user=await User.findByIdAndUpdate(req.user._id,{
//$addToSet add if not exist , if exist will not added again (auto validation not from us ) :
$addToSet:{wishlist:req.body.productId},
},{new:true});
res.status(200).json({status:'success',message:'Product added successfuly to your wishlist',data:user.wishlist});
});

// @disc remove product from wishlist
// @route Post /api/v1/wishlist
// @access private (potect logged user)
exports.deleteProductToWishlist=asyncHandler(async(req,res,next)=>{
    // remove value from array in mongodb :
    const user=await User.findByIdAndUpdate(req.user._id,{
    //$pull remove product from wishlist array if exist :
    $pull:{wishlist:req.params.productId},
    },{new:true});
    res.status(200).json({status:'success',message:'Product removed successfuly from your wishlist',data:user.wishlist});
    });

// @disc Get Logged User Wishlist
// @route Post /api/v1/wishlist
// @access private (potect logged user)
exports.getLoggedUserWishlist=asyncHandler(async(req,res,next)=>{
const user=await User.findById(req.user._id).populate('wishlist');

res.status(200).json({status:'success',results:user.wishlist.length,data:user.wishlist});
});