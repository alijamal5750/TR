const express = require('express');

const{signUp,login,forgetPassword,verifyPasswrodResetCode,resetPassword,testSending}
 = require('../services/authService');

 const { singupValidator,loginValidator }
 = require('../utils/validators/authValidator');
 
const router=express.Router();

//router.route('/login').post(loginValidator,login);
router.post('/signup',singupValidator,signUp);
router.post('/login',loginValidator,login);
router.post('/forgetPassword',forgetPassword);
router.post('/verifyResetPasswordCode',verifyPasswrodResetCode);
router.post('/resetPassword',resetPassword);
router.post('/sendtest',testSending);



module.exports=router;