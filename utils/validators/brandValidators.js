const { check,body } = require('express-validator');
const  slugify = require('slugify');
const ValidatorMiddlware = require('../../middlwares/validatorMiddleware');

exports.getBrandValidator=[
    // 1- rules
    check('id').isMongoId().withMessage('Invalid Brand id format'),
    // 2- middlwares
    ValidatorMiddlware,
];

exports.createBrandValidator=[
    check("name").notEmpty().withMessage('Brand name required')
    .isLength({min:3}).withMessage('Too short Brand name').isLength({max:32}).withMessage('Too long Brand name').custom((val,{req}) =>{
        req.body.slug=slugify(val);
        return true;
    }),
    ValidatorMiddlware,
];

exports.updateBrandValidator=[
    // 1- rules
    check('id').isMongoId().withMessage('Invalid Brand id format'),
    body('name').optional().custom((val,{req}) =>{
        req.body.slug=slugify(val);
        return true;
    }),
    // 2- middlwares
    ValidatorMiddlware,
];

exports.deleteBrandValidator=[
    // 1- rules
    check('id').isMongoId().withMessage('Invalid Brand id format'),
    // 2- middlwares
    ValidatorMiddlware,
];