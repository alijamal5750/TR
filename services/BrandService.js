const Brand = require("../models/brandModdel");
const factroy=require('./handlersFactory');
const {uploadSingleImage}=require('../middlwares/uploadImageMiddleware');
const asyncHandler=require('express-async-handler');
const{v4:uuidv4}=require('uuid');
const sharp=require('sharp');


// upload single image :
exports.uploadBrandImage=uploadSingleImage('image');

// for image processing :
exports.resizeImage=asyncHandler(async(req,res,next)=>{
const filename= `brand-${uuidv4()}-${Date.now()}.jpeg`;

await sharp(req.file.buffer)
.resize(600,600)
.toFormat('jpeg')
.jpeg({quality:95})
.toFile(`uploads/brands/${filename}`);

// save image after processing to the DB : 
req.body.image=filename;
next();
});


// @disc get list of Brand
// @route GET /api/v1/Brand
// @access Public
exports.getBrands = factroy.getAll(Brand);

// @disc Create Brand
// @route POST /api/v1/Brand
// @access Private (admin)
exports.createBrand = factroy.createOne(Brand);

// @disc get specific Brand by id
// @route GET /api/v1/Brand/id
// @access Private (admin)
exports.getBrand= factroy.getOne(Brand);

// @disc update specific Brand
// @route GET /api/v1/Brand/id
// @access Private (admin)
exports.updateBrand = factroy.updateOne(Brand);

// @disc delete specific Brand
// @route GET /api/v1/Brand/id
// @access Private (admin)
exports.deleteBrand = factroy.deleteOne(Brand);
/* asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  // new: true return the ategory after updated if we dont put this will return the Brand before updated!
  const brand = await Brand.findByIdAndDelete(id);
  if (!brand) {
    return next(new ApiError(`No Brand with id : ${id}`, 404));
  }
  res.status(204).send();
});
 */