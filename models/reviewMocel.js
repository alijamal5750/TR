const mongoose=require('mongoose');
const Product=require('./productModel');

const reviewSchema=new mongoose.Schema({
    title:{
        type:String,
    },
    ratings:{
        type:Number,
        min:[1,'Min ratings value is 1.0'],
        max:[5,'Max ratings value is 5.0'],
        required: [true,'Review ratings is required']
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:[true,'Review must belong to user'],
    },
    // parent refrence : one to many
    product:{
        type:mongoose.Schema.ObjectId,
        ref:'Product',
        required:[true,'Review must belong to product'],
    },

},{timestamps:true});

reviewSchema.pre(/^find/,function(next){
this.populate({path:'user',select:'name'});
next();
});

// Aggreegation : do when create,update,delete a Review
reviewSchema.statics.calcAverageRatingsAndQuantity=async function(productId){
    const resault= await this.aggregate([
        // Stage 1 : Get all reviews on specific product 
        {
            $match:{product:productId}
        },
        // Stage 2 : Grouping Reviews based on productId and calclaute avgRatings,ratingsQuantity
        {
            $group:{
                _id:'prodcut'
                ,avgRatings:{$avg:'$ratings'}
                ,ratingsQuantity:{$sum:1}
            }
        },
    ]);
    if(resault.length > 0) {
        // update product : 
        await Product.findByIdAndUpdate(productId,{
            ratingsAverage:resault[0].avgRatings,
            ratingsQuantity:resault[0].ratingsQuantity,
        });
    }
    // if there is no reviews for this product : 
    else{
        await Product.findByIdAndUpdate(productId,{
        ratingsAverage:0,
        ratingsQuantity:0,
    });
}
};

// call on Create : to call the function on update go to handlerService on updateOne and in the end add documnet.save() to trigger the same code below and run it : 
reviewSchema.post('save',async function(){
    // this.product in ReviewSchmea : 
await this.constructor.calcAverageRatingsAndQuantity(this.product);
});

// on remove also go to handlersService and add drocment.remove() to Trigger the Code Below : 
reviewSchema.post('remove',async function(){
    // this.product in ReviewSchmea : 
await this.constructor.calcAverageRatingsAndQuantity(this.product);
});

module.exports=mongoose.model('Review',reviewSchema);