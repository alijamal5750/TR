const mongoose = require('mongoose');

const productSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true,
        minlength:[3,'Too Short Product Title'],
        maxlength:[100,'Too Short Product Title']
    },
    slug:{
        type:String,
        required:true,
        lowercase:true,
    },
    description:{
        type:String,
        required:[true,'Product Description is required'],
        minlength:[20,'Too Short Product Description']
    },
    quantity:{
        type:Number,
        required:[true,'Product Quantity is required'],
    },
    sold:{
        type:Number,
        default:0,
    },
    price:{
       type: Number,
       required:[true,'Product Price is required'],
       trim:true,
       max:[200000,'Too Long Product Price']
    },
    priceAfterDiscount:{
        type: Number,
    },
    colors:[String],

    imageCover:{
        type:String,
        required:[true,'Product Image Cover is required'],
    },
    images:[String],
    
    category:{
        type:mongoose.Schema.ObjectId,
        ref:'Category',
        required:[true,'Product Must be belong to a category'],
    },
    subCategories:[{
        type:mongoose.Schema.ObjectId,
        ref:'SubCategory',
    },
],

brand:{
    type:mongoose.Schema.ObjectId,
    ref:'Brand',
},

ratingsAverage:{
    type:Number,
    min:[1,'Rating must be above or equal to 1.0'],
    max:[5,'Rating must be below or equal to 5.0'],
},

ratingsQuantity:{
    type:Number,
    default:0,
},

},
{
    timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
}
);

// create virtual field with name (reviews) from ref and foreign and localField (_id in productSchema) :
// add reviews field to getOne handler in both product service and modify in handlersFactory :
//also to enable virtauls populate => add tojson and toObject beside ^ timestamps ^ to activate virtuals : 
productSchema.virtual('reviews'
,{ref:'Review',foreignField:'product',localField:'_id'}
);

// mongoose query middleware for populate columns : 
productSchema.pre(/^find/,function(next) {
// this refer to the query :
    this.populate({
   path:'category',
   select:'name',
    });
    next();
});

const setImageURL=(doc)=>{
    // return image base url + image name : 
    if(doc.imageCover){
        const imageUrl=`${process.env.BASE_URL}/products/${doc.imageCover}`;
        doc.imageCover=imageUrl;
    }

    if(doc.images){
        const imagesList=[];
        doc.images.forEach((image) =>{
            const imageUrl=`${process.env.BASE_URL}/products/${image}`;
            imagesList.push(imageUrl);
        });
        doc.images=imagesList;
    }
        };
    
        // get image url based on envionment : works with findall,update,get by id : 
       productSchema.post('init',(doc)=>{
        setImageURL(doc);
       });
    
        // get image url based on envionment : works with Create :
        productSchema.post('save',(doc)=>{
        setImageURL(doc);
       });

module.exports=mongoose.model('Product',productSchema);