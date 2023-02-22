const { check,body } = require('express-validator');
const  slugify = require('slugify');
const ValidatorMiddlware = require('../../middlwares/validatorMiddleware');
const User=require('../../models/userModel');
const bcrypt=require('bcryptjs');

exports.getUserValidator=[
    // 1- rules
    check('id').isMongoId().withMessage('Invalid User id format'),
    // 2- middlwares
    ValidatorMiddlware,
];

exports.createUserValidator=[
    check("name").notEmpty().withMessage('User name required')
    .isLength({min:3}).withMessage('Too short User name').custom((val,{req}) =>{
        req.body.slug=slugify(val);
        return true;
    }),

    check('email').notEmpty().withMessage('email required')
    .isEmail().withMessage('Invalid email address')
    .custom((val) => User.findOne({email:val}).then((user)=>{
        if(user){
            return Promise.reject(new Error('Email already in use !'));
        }
    })
    ),
    check('phone').optional().isMobilePhone(["ar-IQ"]).withMessage('Invalid Phone Number Only accept IQ Numbers'),
  
    // passwordConfirmation is not a field in model !
    check('passwordConfirm').notEmpty().withMessage('password confimeation required'),

    check("password").notEmpty().withMessage('password required')
    .isLength({min:6}).withMessage('password must be at least 6 chars').custom((password,{req})=> {
    if(password !==req.body.passwordConfirm) {
        throw new Error('password Confirmation incorrect');
    }
    return true;
}),
    check('profileImg').optional(),    
    check("role").optional(),
    ValidatorMiddlware,
];

exports.updateUserValidator=[
    // 1- rules
    check('id').isMongoId().withMessage('Invalid User id format'),
    body('name').optional().custom((val,{req}) =>{
        req.body.slug=slugify(val);
        return true;
    }),
    check('email').notEmpty().withMessage('email required')
    .isEmail().withMessage('Invalid email address')
    .custom((val) => User.findOne({email:val}).then((user)=>{
        if(user){
            return Promise.reject(new Error('Email already in use !'));
        }
    })
    ), check('profileImg').optional(),    
    check("role").optional(),
    check('phone').optional()
    .isMobilePhone(["ar-IQ"]).withMessage('Invalid Phone Number Only accept IQ Numbers'),
    // 2- middlwares
    ValidatorMiddlware,
];

exports.updateLoggedUserValidator=[
    // 1- rules
    body('name').optional().custom((val,{req}) =>{
        req.body.slug=slugify(val);
        return true;
    }),
    check('email').notEmpty().withMessage('email required')
    .isEmail().withMessage('Invalid email address')
    .custom((val) => User.findOne({email:val}).then((user)=>{
        if(user){
            return Promise.reject(new Error('Email already in use !'));
        }
    })
    ), 
    check('phone').optional()
    .isMobilePhone(["ar-IQ"]).withMessage('Invalid Phone Number Only accept IQ Numbers'),
    // 2- middlwares
    ValidatorMiddlware,
];

exports.changeUserPasswordValidator=[
check('id').isMongoId().withMessage('Invalid User id format'),
check('currentPassword').notEmpty().withMessage('you must enter your current Password'),
check('passwordConfirm').notEmpty().withMessage('you must enter the Password Confirm'),
check('password').notEmpty().withMessage('you must enter New Password').custom(async(val,{req})=>{
// 1- verify current password
const user=await User.findById(req.params.id);
if(!user){
    throw new Error('there is no user for this ID');
}
const isCorrectPassword=await bcrypt.compare(req.body.currentPassword,user.password); // return true or false
if(!isCorrectPassword){
    throw new Error('inCorrect Current Password');
}

// 2- verify New password meet passwordConfirm
if(val !==req.body.passwordConfirm) {
    throw new Error('password Confirmation incorrect');
}
return true;

}),
ValidatorMiddlware,
];

exports.deleteUserValidator=[
    // 1- rules
    check('id').isMongoId().withMessage('Invalid User id format'),
    // 2- middlwares
    ValidatorMiddlware,
];