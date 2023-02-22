const express = require('express');

const{getUsers,createUser,getUser,updateUser,deleteUser,uploadUserImage
    ,resizeImage,chnageUserPassword,getLoggedUserData
    ,updateLoggedUserPassword,updateLoggedUserData,deleteLoggedUserData}
 = require('../services/userService');

 const { createUserValidator,getUserValidator,updateUserValidator,deleteUserValidator
    ,changeUserPasswordValidator,updateLoggedUserValidator }
 = require('../utils/validators/userValidator');
 
const authService=require('../services/authService');

const router=express.Router();

router.get('/getMe',authService.protect,getLoggedUserData,getUser);
router.put('/changeMyPassword',authService.protect,updateLoggedUserPassword);
router.put('/updateMe',authService.protect,updateLoggedUserValidator,updateLoggedUserData);
router.delete('/deleteMe',authService.protect,deleteLoggedUserData);


router.put('/changePassword/:id',changeUserPasswordValidator,chnageUserPassword);


// you can use router.use(authService.protect,authService.allowedTo('admin','manager'));this will aplply on all

router.route('/').get(authService.protect,authService.allowedTo('admin')
,getUsers).post(authService.protect,authService.allowedTo('admin')
,uploadUserImage,resizeImage,createUserValidator,createUser);
router.route('/:id').get(authService.protect,authService.allowedTo('admin')
,getUserValidator,getUser)
    .put(authService.protect,authService.allowedTo('admin')
    ,uploadUserImage,resizeImage,updateUserValidator,updateUser).delete(authService.protect,authService.allowedTo('admin')
    ,deleteUserValidator,deleteUser);

module.exports=router;