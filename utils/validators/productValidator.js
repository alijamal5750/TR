const{check, body}=require('express-validator');
const ValidatorMiddlware = require('../../middlwares/validatorMiddleware');
const Category=require('../../models/categoryModel');
const slugify = require("slugify");
const SubCategory=require('../../models/subCategoryModel');


exports.createProductValidator=[
check('title').isLength({min:3}).withMessage('must be at least 3 chars').notEmpty().withMessage('Product title Required').custom((val,{req}) =>{
    req.body.slug=slugify(val);
    return true;
}),
check('description').isLength({max:2000}).withMessage('To long product description').notEmpty().withMessage('Product description Required'),
check('quantity').isNumeric().withMessage('product quantity must be a number').notEmpty().withMessage('Product quantity Required'),
check('sold').optional().isNumeric().withMessage('product sold must be a number'),
check('price').isNumeric().withMessage('product price must be a number').notEmpty().withMessage('Product price Required').isLength({max:32}).withMessage('Too long proudct price'),
check('priceAfterDiscount').optional().isNumeric().withMessage('product priceAfterDiscount must be a number').toFloat().custom((value,{req})=>{
    if(req.body.price <= value){
        throw new Error('product priceAfterDiscount must be lower than price');
    }
    return true;
}),
check('colors').optional().isArray().withMessage('availableColors should be an array'),
check('imageCover').notEmpty().withMessage('proudct imageCover is required'),
check('images').optional().isArray().withMessage('images should be an array'),
check('category').notEmpty().withMessage('product category is required').isMongoId().withMessage('Invalid Category Id format').custom((categoryId) =>Category.findById(categoryId).then((category)=>{
if(!category){
    return Promise.reject(new Error(`No Category for this Id: ${categoryId}`));
}
})
),
check('subCategories').optional().isMongoId().withMessage('Invalid subCategories  Id format')
.custom((subCategoriesIds)=>SubCategory.find({_id:{$exists:true,$in:subCategoriesIds}}).then(
(result)=>{
    if(result.length <1 || result.length !== subCategoriesIds.length){
        return Promise.reject(new Error(`No SubCategoriesIds`));
    }
}
)
// get subcaatgories by category id from body
).custom((val,{req})=>SubCategory.find({category:req.body.category})
.then((subcategories)=>{
    const subCategoriesIdInDB=[];
    subcategories.forEach(subCategory=>{
        subCategoriesIdInDB.push(subCategory._id.toString());
    });
    // check if subcategories id in db include subcategories in req.body (true , false)
    const checker=(target,arr)=>target.every((v) =>arr.includes(v))
if(!checker(val,subCategoriesIdInDB)){
    return Promise.reject(new Error(`SubCategories not belong to Category`));
}
}
)
),



check('brand').optional().isMongoId().withMessage('Invalid brand Id format'),
check('ratingsAverage').optional().isNumeric().withMessage('ratingsAverage mus be a number').isLength({min:1}).withMessage('ratingsAverage must be above or equal to 1.0').isLength({max:5}).withMessage('ratingsAverage must be below or equal to 5.0'),
check('ratingsQuantity').optional().isNumeric().withMessage('ratingsQuantity mus be a number'),
ValidatorMiddlware,
];


exports.getProductValidator=[
    // 1- rules
    check('id').isMongoId().withMessage('Invalid Product id format'),
    // 2- middlwares
    ValidatorMiddlware,
];

exports.updateProductValidator=[
    // 1- rules
    check('id').isMongoId().withMessage('Invalid Product id format'),
    body('title').optional().custom((val,{req}) =>{
        req.body.slug=slugify(val);
        return true;
    }),
    // 2- middlwares
    ValidatorMiddlware,
];

exports.deleteProductValidator=[
    // 1- rules
    check('id').isMongoId().withMessage('Invalid Product id format'),
    // 2- middlwares
    ValidatorMiddlware,
];