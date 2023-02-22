const User = require("../models/userModel");
const factroy=require('./handlersFactory');
const {uploadSingleImage}=require('../middlwares/uploadImageMiddleware');
const asyncHandler=require('express-async-handler');
const{v4:uuidv4}=require('uuid');
const sharp=require('sharp');
const ApiError = require("../utils/apiError");
const createToken=require('../utils/createToken');
const bcrypt=require('bcryptjs');require('dotenv').config();


// upload single image :
exports.uploadUserImage=uploadSingleImage('profileImg');

// for image processing :
exports.resizeImage=asyncHandler(async(req,res,next)=>{
const filename= `user-${uuidv4()}-${Date.now()}.jpeg`;

if(req.file){
    await sharp(req.file.buffer)
    .resize(600,600)
    .toFormat('jpeg')
    .jpeg({quality:95})
    .toFile(`uploads/users/${filename}`);
    
    // save image after processing to the DB : 
    req.body.profileImg=filename;
}
next();
});


// @disc get list of Users
// @route GET /api/v1/Users
// @access private
exports.getUsers = factroy.getAll(User);

// @disc Create User
// @route POST /api/v1/Users
// @access Private (admin)
exports.createUser = factroy.createOne(User);

// @disc get specific User by id
// @route GET /api/v1/User/id
// @access Private (admin)
exports.getUser= factroy.getOne(User);

// @disc update specific User
// @route GET /api/v1/User/id
// @access Private (admin)
exports.updateUser = asyncHandler(async (req, res, next) => {
 
    // for slug add the validation to validation.js or create new middleware and add it to routes before update
    
     const documnet = await User.findByIdAndUpdate(
       req.params.id,
       {
        name:req.body.name,
        slug:req.body.slug,
        phone:req.body.phone,
        email:req.body.email,
        profileImg:req.body.profileImg,
        role:req.body.role,
       },
       { new: true }
     );
   
     if (!documnet) {
       return next(new ApiError(`No documnet with id : ${id}`, 404));
     }
     res.status(200).json({ data: documnet });
   });

exports.chnageUserPassword=asyncHandler(async (req, res, next) => {
 
    // for slug add the validation to validation.js or create new middleware and add it to routes before update
    
     const documnet = await User.findByIdAndUpdate(
       req.params.id,
       {
        password:await bcrypt.hash(req.body.password,12),
        passwordChangedAt:Date.now(),
       },
       { new: true }
     );
   
     if (!documnet) {
       return next(new ApiError(`No documnet with id : ${id}`, 404));
     }
     res.status(200).json({ data: documnet });
   });

// @disc delete specific User
// @route GET /api/v1/User/id
// @access Private (admin)
exports.deleteUser = factroy.deleteOne(User);


// @disc Get logged user data
// @route GET /api/v1/User/getMe
// @access Private/protect (logged user)
exports.getLoggedUserData=asyncHandler(async(req,res,next)=>{
// userId comes from protect :
  req.params.id=req.user.id;
next();
});

// @disc update logged user password
// @route put /api/v1/User/updateMyPassword
// @access Private/protect (logged user)
exports.updateLoggedUserPassword=asyncHandler(async (req, res, next) => {
 
  // for slug add the validation to validation.js or create new middleware and add it to routes before update
  
  // 1 - update user based on user payload (req.user._id) from protect(logged) ;
   const user = await User.findByIdAndUpdate(
     req.user._id,
     {
      password:await bcrypt.hash(req.body.password,12),
      passwordChangedAt:Date.now(),
     },
     { new: true }
   );
  
   // Generate Token : 
   const token = createToken(user._id);
   res.status(200).json({ data: user,token });
 });

 // @disc update logged user Data(without password and role)
// @route put /api/v1/User/updateMe
// @access Private/protect (logged user)
exports.updateLoggedUserData=asyncHandler(async (req, res, next) => {
 
  // for slug add the validation to validation.js or create new middleware and add it to routes before update
  
   const documnet = await User.findByIdAndUpdate(
     req.user._id,
     {
      name:req.body.name,
      slug:req.body.slug,
      phone:req.body.phone,
      email:req.body.email,
     
     },
     { new: true }
   );
   
   res.status(200).json({ data: documnet });
 });

  // @disc Deactiveate Logged User
// @route delete /api/v1/User/deleteMe
// @access Private/protect (logged user)
exports.deleteLoggedUserData=asyncHandler(async(req,res,next)=>{
await User.findByIdAndUpdate(req.user._id,{active:false});
res.status(204).json({status:'success'});
});

