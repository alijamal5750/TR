const Product = require("../models/productModel");
const factroy=require('./handlersFactory');
const{v4:uuidv4}=require('uuid');
const sharp=require('sharp');
const asyncHandler = require("express-async-handler");
const { uploadMixOfImages } = require("../middlwares/uploadImageMiddleware");


exports.uploadProductImages=uploadMixOfImages(
  [{name:'imageCover',maxCount:1}
  ,{name:'images',maxCount:5},
]);

exports.resizeProductImages=asyncHandler(async(req,res,next)=>{
//console.log(req.files);
// 1-image processing for imageCover : 
if(req.files.imageCover){
  const imageCoverFileName= `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

await sharp(req.files.imageCover[0].buffer)
.resize(2000,1333)
.toFormat('jpeg')
.jpeg({quality:95})
.toFile(`uploads/products/${imageCoverFileName}`);

// save image after processing to the DB : 
req.body.imageCover=imageCoverFileName;
}

// 2-image processing for images : 
if(req.files.images){
  req.body.images=[];
  // map function for loop : 
 await Promise.all( req.files.images.map(async(img,index)=>{
  const imageName= `product-${uuidv4()}-${Date.now()}-${index +1}.jpeg`;
await sharp(img.buffer)
.resize(2000,1333)
.toFormat('jpeg')
.jpeg({quality:95})
.toFile(`uploads/products/${imageName}`);

// save image after processing to the DB : 
req.body.images.push(imageName);
}));
next();
}
});

// @disc get list of Products
// @route GET /api/v1/products
// @access Public
exports.getProducts = factroy.getAll(Product,'Product');
// @disc Create Product
// @route POST /api/v1/products
// @access Private (admin)
exports.createProduct = factroy.createOne(Product);

// @disc get specific product by id
// @route GET /api/v1/products/id
// @access Private (admin)
exports.getProduct = factroy.getOne(Product,'reviews');

// @disc update specific product
// @route GET /api/v1/products/id
// @access Private (admin)
exports.updateProduct = factroy.updateOne(Product);

// @disc delete specific product
// @route GET /api/v1/products/id
// @access Private (admin)
exports.deleteProduct = factroy.deleteOne(Product);
/* asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  // new: true return the product after updated if we dont put this will return the category before updated!
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    return next(new ApiError(`No product with id : ${id}`, 404));
  }
  res.status(204).send();
});
 */