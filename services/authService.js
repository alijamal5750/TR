const crypto=require('crypto');
const User = require("../models/userModel");
const asyncHandler=require('express-async-handler');
const ApiError = require("../utils/apiError");
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const sendEmail=require('../utils/sendEmail');
const createToken=require('../utils/createToken');
const nodemailer = require("nodemailer");
const sgMail = require('@sendgrid/mail')

// @disc SignUp
// @route GET /api/v1/auth/signup
// @access Public
exports.signUp=asyncHandler(async(req,res,next) =>{
// 1-Create User : 
    const user=await User.create({
 name:req.body.name,
 email:req.body.email,
 password:req.body.password,
    });

    // 2- Generate Token : Payload,secretkey,expiredata : 
   const token= createToken(user._id);

        res.status(201).json({data:user,token});
});

// @disc SingIn
// @route GET /api/v1/auth/signin
// @access Public
exports.login=asyncHandler(async(req,res,next)=>{
// 1- chec if password and email in the body(validation) :
// 2- check if iser exist and password corret : 
const user=await User.findOne({email:req.body.email});

if(!user || !await bcrypt.compare(req.body.password,user.password)){
    return next(new ApiError('Incorrect Email Or Password',401));
}
// 3- Generate Token : 
const token=createToken(user._id);

// 4- send response to client side : 
res.status(200).json({data:user,token});
});

// make sure the user is logged in :
exports.protect=asyncHandler(async(req,res,next)=>{
// 1- check if token exist so took it : 
let token;
if(req.headers.authorization && req.headers.authorization.startsWith('Bearer') ){
token=req.headers.authorization.split(' ')[1];
}
if(!token){
    return next(new ApiError('you are not login,please login to get access this route',401));
}
// 2- decoded return userId and expiretime, verify token (no change happend in payload or expire token) : add it in the GlobalErrorMiddleware
const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY);
// 3- check if user exist : if user deleted but the token still saved ! , delete and check with last token before deleteing the user
const currentUser=await User.findById(decoded.userId);
if(!currentUser){
    return next(new ApiError('the user that belong to this token does no longer exist',401));
}
// 4- check if user change his password after token created :
// add field to changeUserPassword(userService) and in userSchema called changePasswordAt
if(currentUser.passwordChangedAt){

    // convert from ms to second 
    const passwordCahngedTimeStamp=parseInt(currentUser.passwordChangedAt.getTime() / 1000,10);
    // passsword changed after token created : Error
    if(passwordCahngedTimeStamp > decoded.iat){
        return next(new ApiError('the user recently changed his password please login again',401));
    }
}

// access All User info in middlewares after protectRoute by req.user and value from cruuentUser Directly :
req.user=currentUser;
next();
});

// user permissions Authorization : 
// ... roles for access ['admin','manager'] roles : <access parameter from external function by internal function...clushers concept>
exports.allowedTo=(...roles) => asyncHandler(async(req,res,next) =>{
// 1- access roles : 
// 2- get register user by req.user (end of protect handler) :
if(!roles.includes(req.user.role)){
    return next(new ApiError('you are not allowed to access this route',403));
 }
 next();
});

// @disc forgetPassword
// @route Post /api/v1/auth/forgetPassword
// @access Public
exports.forgetPassword=asyncHandler(async(req,res,next)=>{
// 1- get user by Email : 
const user=await User.findOne({email:req.body.email});
if(!user){
    return next(new ApiError(`there is no user with this email ${req.body.email}`,404));
}
// 2- if User Exist...Generate reset Random 6 digits and save it in db : convert to string(crypto library accept only string)
const resetCode=Math.floor(100000 + Math.random() * 900000).toString();
const hashResetCode=crypto.createHash('sha256').update(resetCode).digest('hex');
// save hashResetCode in db : add to model passwordResetCode and PasswordResetExpires and passwordResetVerified
user.passwordResetCode=hashResetCode;
// add expireation time 10 mins by convert ms to seconds(*1000)
user.PasswordResetExpires=Date.now() +10 *60 *1000;
// verified = false...until we recevied the reset code via email and change it (verified=true) : 
user.passwordResetVerified=false;
// save to db
await user.save();
// 3- send the reset code via Email :

const message=`Hi ${user.name},\n We received a request to reset the password on your E-shop Account \n ${resetCode} \n Enter the code to complete the request \n thanks for hepling us keep your account secure.`;

try{
   await sendEmail({
        email:user.email,
        subject:'your password reset code (valid for 10 min)',
        message,
    }); 
}catch(err){
    user.passwordResetCode=undefined;
    user.PasswordResetExpires=undefined;
    user.passwordResetVerified=undefined;

    await user.save();
    return next(new ApiError('there is an error in sending email',500));
}
res.status(200).json({status:'success',message:'reset code sent to email'});
});


// @disc verifyPasswrodResetCode
// @route Post /api/v1/auth/verifyResetPassword
// @access Public
exports.verifyPasswrodResetCode=asyncHandler(async(req,res,next)=>{
// 1- get user by ResetCode : 
const hashResetCode=crypto.createHash('sha256').update(req.body.resetCode).digest('hex');

// passwordResetExpire > Date.now() :
const user=await User.findOne({passwordResetCode:hashResetCode
    ,passwordResetCode:{$gt:Date.now()}});

 if(!user){
    return next(new ApiError(`reset code Invalid or Expired !`,404));
 }

// 2- if resetCode Valid : 
user.passwordResetVerified=true;
await user.save();

res.status(200).json({
status:'success',
});

});


// @disc resetPassword
// @route Post /api/v1/auth/resetPassword
// @access Public
exports.resetPassword=asyncHandler(async(req,res,next)=>{
const user=await User.findOne({email:req.body.email});
if(!user){
    return next(new ApiError(`there is no user with this email : ${req.body.email}`,404));
}

if(!user.passwordResetVerified){
    return next(new ApiError(`Reset Code not Verified !`,400));
}

user.password=bcrypt.hash(req.body.newPassword,12);

    user.passwordResetCode=undefined;
    user.PasswordResetExpires=undefined;
    user.passwordResetVerified=undefined;
    await user.save();

    // if everything ok : Generate Token 
    const token=createToken(user._id);
    res.status(200).json({token});

});

exports.testSending=asyncHandler(async(req,res,next) =>{
   let transporter = nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
          user: "apikey",
          pass: process.env.SENDGRID_API_KEY
      }
   });

   transporter.sendMail({
    from: "alikong8000@gmail.com", // verified sender email
    to: "alikong7000@gmail.com", // recipient email
    subject: "Test message subject", // Subject line
    text: "Hello world!", // plain text body
    html: "<b>Hello world!</b>", // html body
  }, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  
  });