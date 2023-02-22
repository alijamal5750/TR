const express = require('express');
const subCategoryRoute =require('./subCategoryRoute');

const{getCategories,createCategory,getCategory,updateCategory,deleteCategory,uploadCategoryImage,resizeImage}
 = require('../services/categoryService');

const { getCategoryValidator,createCategoryValidator,updateCategoryValidator,deleteCategoryValidator }
 = require('../utils/validators/categoryValidator');

const authService=require('../services/authService');

const router=express.Router();

// nested route add megrgeparams:true in subCategoryRoute to access parameters 
router.use('/:categoryId/subcategories',subCategoryRoute);

router.route('/').get(getCategories).post(authService.protect,authService.allowedTo('admin','manager')
,uploadCategoryImage,resizeImage,createCategoryValidator,createCategory);
router.route('/:id').get(getCategoryValidator,getCategory)
    .put(authService.protect,authService.allowedTo('admin','manager')
    ,uploadCategoryImage,resizeImage,updateCategoryValidator,updateCategory)
    .delete(authService.protect,authService.allowedTo('admin'),deleteCategoryValidator,deleteCategory);

module.exports=router;