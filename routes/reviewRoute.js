const express = require('express');

const{getReviews,createReview,getReview,updateReview,deleteReview,createFilterObj,setProductIdAndUserIdToBody}
 = require('../services/ReviewService');

 const { createReviewValidator,updateReviewValidator,getReviewValidator,deleteReviewValidator}
 = require('../utils/validators/reviewValidator');

 const authService=require('../services/authService');

const router=express.Router({mergeParams:true});


router.route('/').get(createFilterObj,getReviews).post(authService.protect,authService.allowedTo('user')
,setProductIdAndUserIdToBody,createReviewValidator,createReview);

router.route('/:id').get(getReviewValidator,getReview)
    .put(authService.protect,authService.allowedTo('user')
    ,updateReviewValidator,updateReview).delete(authService.protect,authService.allowedTo('admin','manager','user')
    ,deleteReviewValidator,deleteReview);

module.exports=router;