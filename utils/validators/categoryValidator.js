const { check,body } = require('express-validator');
const ValidatorMiddlware = require('../../middlwares/validatorMiddleware');
const slugify = require("slugify");


exports.getCategoryValidator=[
    // 1- rules
    check('id').isMongoId().withMessage('Invalid Category id format'),
    // 2- middlwares
    ValidatorMiddlware,
];

exports.createCategoryValidator=[
    check("name").notEmpty().withMessage('Category name required')
    .isLength({min:3}).withMessage('Too short Category name').isLength({max:32}).withMessage('Too long Category name').custom((val,{req}) =>{
        req.body.slug=slugify(val);
        return true;
    }),
    ValidatorMiddlware,
];

exports.updateCategoryValidator=[
    // 1- rules
    check('id').isMongoId().withMessage('Invalid Category id format'),
    body('name').optional().custom((val,{req}) =>{
        req.body.slug=slugify(val);
        return true;
    }),
    // 2- middlwares
    ValidatorMiddlware,
];

exports.deleteCategoryValidator=[
    // 1- rules
    check('id').isMongoId().withMessage('Invalid Category id format'),
    // 2- middlwares
    ValidatorMiddlware,
];