const express = require('express');

const {
  createSubCategory,
  setCategorIdToBody,
  getSubCategories,
  createFilterObj,
  getsubCategory,
  updatesubCategory,
  deletesubCategory,
} = require('../services/SubCategoryService');
const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
  
} = require('../utils/validators/subCategoryValidator');

const authService=require('../services/authService');

// allow to access paramters from another Source or Route !
const router = express.Router({mergeParams: true});

router.route('/')
  .post(authService.protect,authService.allowedTo('admin','manager')
  ,setCategorIdToBody,createSubCategoryValidator, createSubCategory)
  .get(createFilterObj,getSubCategories);

router.route('/:id').get(getSubCategoryValidator,getsubCategory)
.put(authService.protect,authService.allowedTo('admin','manager')
,updateSubCategoryValidator,updatesubCategory).delete(authService.protect,authService.allowedTo('admin')
,deleteSubCategoryValidator,deletesubCategory);

module.exports = router;
