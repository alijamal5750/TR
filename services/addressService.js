const User = require("../models/userModel");
const asyncHandler=require('express-async-handler');


// @disc add address to user addresslist
// @route Post /api/v1/address
// @access private (potect logged user)
exports.addAddress=asyncHandler(async(req,res,next)=>{
// add value to array in mongodb :
const user=await User.findByIdAndUpdate(req.user._id,{
//$addToSet add if not exist , if exist will not added again (auto validation not from us ) :
$addToSet:{addresses:req.body},
},{new:true});
res.status(200).json({status:'success',message:'Address added successfuly to your address list',data:user.addresses});
});

// @disc delete address from addresslist
// @route Post /api/v1/address/addressId
// @access private (potect logged user)
exports.deleteAddress=asyncHandler(async(req,res,next)=>{
    // remove value from array in mongodb :
    const user=await User.findByIdAndUpdate(req.user._id,{
    //$pull remove product from wishlist array if exist : Object
    $pull:{addresses:{_id:req.params.addressId}},
    },{new:true});
    res.status(200).json({status:'success',message:'address deleted successfuly',data:user.addresses});
    });

    // @disc update address from addresslist
    // @route put /api/v1/address/addressId
    // @access private (potect logged user)
    exports.updateAddress=asyncHandler(async(req,res,next)=>{
        // remove value from array in mongodb :
        //$pull remove product from wishlist array if exist : Object
        const del=await User.findByIdAndUpdate(req.user._id,{
        $pull:{addresses:{_id:req.params.addressId}},
        });

        // then update new Object : 
        const user=await User.findByIdAndUpdate(req.user._id,{
        
        // $push to update 
        $push:{addresses:{_id:req.params.addressId,
            alias:req.body.alias,phone:req.body.phone,city:req.body.city,
        postalCode:req.body.postalCode,details:req.body.details}},
        },{new:true});
        res.status(200).json({status:'success',message:'address updated successfuly',data:user.addresses});
        });

// @disc Get Logged User address
// @route Get /api/v1/address
// @access private (potect logged user)
exports.getLoggedUserAddress=asyncHandler(async(req,res,next)=>{
const user=await User.findById(req.user._id).populate('addresses');

res.status(200).json({status:'success',results:user.addresses.length,data:user.addresses});
});