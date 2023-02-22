const { check,body } = require('express-validator');
const  slugify = require('slugify');
const ValidatorMiddlware = require('../../middlwares/validatorMiddleware');
const Review=require('../../models/reviewMocel');

exports.getReviewValidator=[
    // 1- rules
    check('id').isMongoId().withMessage('Invalid Review id format'),
    // 2- middlwares
    ValidatorMiddlware,
];

exports.createReviewValidator=[
    check("title").optional(),
    check('ratings').notEmpty().withMessage('Ratings is required').isFloat({min:1,max:5}).withMessage('Ratings value must be between 1 to 5'),
    check('user').isMongoId().withMessage('Invalid user id format'),
    check('product').isMongoId().withMessage('Invalid product id format').custom((val,{req}) =>
    Review.findOne({user:req.user._id,product:req.body.product}).then(
        (review)=>{
            if(review){
                return Promise.reject(new Error('you already created a review before'));
            }
        }
    )
    ),
    ValidatorMiddlware,
];

exports.updateReviewValidator=[
    // 1- rules
    check('id').isMongoId().withMessage('Invalid Review id format').custom((val,{req}) =>
        // check review ownership bfore update
        Review.findById(val).then((review)=>{
            if(!review){
                return Promise.reject(new Error('there is no review with this id '));
            }

            // check the userId in review if not equal userId in token (logged in user) : reject the action 
            // if you not do popluate : if(review.user.toString() !==req.user._id.toString())
            // if you do populate the user return in object {id,name,...etc} : fix error below,works on update,delete
            if(review.user._id.toString() !==req.user._id.toString()){
                return Promise.reject(new Error('you are not allowed to perform this action'));
            }

        })
        
    ),
    // 2- middlwares
    ValidatorMiddlware,
];

exports.deleteReviewValidator=[
    // 1- rules
    check('id').isMongoId().withMessage('Invalid Review id format').custom((val,{req}) =>{ 
        // req.user.role cuz in auth route(end of protect handler) req.user=currentUser : carry all user info in token
        if(req.user.role == 'user'){
           return Review.findById(val).then((review)=>{
                if(!review){
                    return Promise.reject(new Error('there is no review with this id '));
                }
                // check the userId in review if not equal userId in token (logged) : reject the action 
                if(review.user._id.toString() !==req.user._id.toString()){
                    return Promise.reject(new Error('you are not allowed to perform this action'));
                }
            });
        }
        // after all validations (if conditions) : like next() go to the next middleware 
        return true;
    }),
    // 2- middlwares
    ValidatorMiddlware,
];