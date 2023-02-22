const { check,body } = require('express-validator');
const  slugify = require('slugify');
const ValidatorMiddlware = require('../../middlwares/validatorMiddleware');
const User=require('../../models/userModel');

exports.singupValidator=[
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
    // passwordConfirmation is not a field in model !
    check('passwordConfirm').notEmpty().withMessage('password confimeation required'),

    check("password").notEmpty().withMessage('password required')
    .isLength({min:6}).withMessage('password must be at least 6 chars').custom((password,{req})=> {
    if(password !==req.body.passwordConfirm) {
        throw new Error('password Confirmation incorrect');
    }
    return true;
}),
    ValidatorMiddlware,
];

exports.loginValidator=[
    check('email').notEmpty().withMessage('email required')
    .isEmail().withMessage('Invalid email address'),
    
    check("password").notEmpty().withMessage('password required')
    .isLength({min:6}).withMessage('password must be at least 6 chars'),
    ValidatorMiddlware,
];