const Review = require("../models/reviewMocel");
const factroy=require('./handlersFactory');


// nested route : create review on product (set product id first ) : 
exports.setProductIdAndUserIdToBody=(req,res,next)=>{
  // if there is no product in body get it from params : 
  if(!req.body.product) req.body.product =req.params.productId;
  // if there is no user in body get it from token (protect only logger user) : 
  if(!req.body.user) req.body.user=req.user._id;
  next();
};

// nested route : get all reviews based on product id 
exports.createFilterObj=(req, res, next) => {
  let filterObject={};
  if(req.params.productId) filterObject={product:req.params.productId};
  req.filterObj=filterObject;
  next();
};

// @disc get list of Review
// @route GET /api/v1/Review
// @access Public
exports.getReviews = factroy.getAll(Review);

// @disc Create Review
// @route POST /api/v1/Review
// @access private protect(role : user)
exports.createReview = factroy.createOne(Review);

// @disc get specific Review by id
// @route GET /api/v1/Review/id
// @access private protect(role : user)
exports.getReview= factroy.getOne(Review);

// @disc update specific Review
// @route GET /api/v1/Review/id
// @access private protect(role : user)
exports.updateReview = factroy.updateOne(Review);

// @disc delete specific Review
// @route GET /api/v1/Review/id
// @access private protect(role : user,admin,manager)
exports.deleteReview = factroy.deleteOne(Review);

