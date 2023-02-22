const { check,body } = require("express-validator");
const slugify = require("slugify");
const ValidatorMiddlware = require("../../middlwares/validatorMiddleware");

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("SubCategory name required")
    .isLength({ min: 2 })
    .withMessage("Too short SubCategory name")
    .isLength({ max: 32 })
    .withMessage("Too long SubCategory name"),
  check("category")
    .notEmpty()
    .withMessage("subCategory must be belong to a category")
    .isMongoId()
    .withMessage("Invalid Category id format"),
  ValidatorMiddlware,
];

exports.getSubCategoryValidator = [
  check('id').isMongoId().withMessage('Invalid SubCategory id format'),
  ValidatorMiddlware,
];

exports.updateSubCategoryValidator = [
  // 1- rules
  check("id").isMongoId().withMessage("Invalid SubCategory id format").
  custom((val,{req}) =>{
    req.body.slug=slugify(val);
    return true;
}),
  // 2- middlwares
  ValidatorMiddlware,
  ];
  
  exports.deleteSubCategoryValidator = [
    // 1- rules
    check("id").isMongoId().withMessage("Invalid SubCategory id format"),
    // 2- middlwares
    ValidatorMiddlware,
  ];
