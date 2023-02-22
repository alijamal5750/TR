const SubCategory = require("../models/subCategoryModel");
const factroy=require('./handlersFactory');

// add this to SubCategory Route
exports.setCategorIdToBody=(req,res,next)=>{
  // nested Route if the categoryId not sent in api request so yyou can use category id by categoryId in the params
  if(!req.body.category) req.body.category =req.params.categoryId;
  next();
};


// Nedsted Route(access Route from another Route)
// Get/api/v1/categories/:categoryId/subcategories (get subCategories under category)
exports.createFilterObj=(req, res, next) => {
  let filterObject={};
  if(req.params.categoryId) filterObject={category:req.params.categoryId};
  req.filterObj=filterObject;

  // or directly : 
  //if(req.params.categoryId) req.filterObj={category:req.params.categoryId};

  next();
};
// @disc get list of SubCategory
// @route GET /api/v1/SubCategory
// @access Public
exports.getSubCategories = factroy.getAll(SubCategory);

// @disc Create subCategory
// @route POST /api/v1/subcategories
// @access Private (admin)
exports.createSubCategory = factroy.createOne(SubCategory);

// @disc get specific SubCategory by id
// @route GET /api/v1/SubCategory/id
// @access Private (admin)
exports.getsubCategory = factroy.getOne(SubCategory);


// @disc update specific subCategory
// @route GET /api/v1/subCategory/id
// @access Private (admin)
exports.updatesubCategory = factroy.updateOne(SubCategory);

// @disc delete specific subCategory
// @route GET /api/v1/subCategory/id
// @access Private (admin)
exports.deletesubCategory = factroy.deleteOne(SubCategory)

/* asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  // new: true return the ategory after updated if we dont put this will return the category before updated!
  const subCategory = await SubCategory.findByIdAndDelete(id);
  if (!subCategory) {
    return next(new ApiError(`No subCategory with id : ${id}`, 404));
  }
  res.status(204).send();
}); */