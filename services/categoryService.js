const Category = require("../models/categoryModel");
const factroy=require('./handlersFactory');
const{v4:uuidv4}=require('uuid');
const sharp=require('sharp');
const asyncHandler=require('express-async-handler');
const {uploadSingleImage}=require('../middlwares/uploadImageMiddleware');

// Save Images Without Image-Processing
 // for images : multerStorage to insert the exentsion of the file before save it also good for checking the files
// 1- DiskStorage Engine
/* const multerStorage=multer.diskStorage({
  destination:function (req,file,cb) {
    cb(null,'uploads/categories');
  },
  filename:function(req,file,cb){
//    uniqe fiename name => category-id or date extenstion or use package uuid 
    const ext=file.mimetype.split('/')[1];
    const filename= `category-${uuidv4()}-${Date.now()}.${ext}`;
    cb(null,filename);
  },
}); */

// MemoryStorage Engine to use buffer :
/* const multerStorage=multer.memoryStorage();

//for filteration : 
const multerFilter=function (req,file,cb) {
if(file.mimetype.startsWith('image')){
  cb(null,true);
}else{
cb(new ApiError('only images allowed',400),false);
}
}; 

const upload=multer({storage:multerStorage,fileFilter:multerFilter});
 */

// upload single image :
exports.uploadCategoryImage=uploadSingleImage('image');

// for image processing :
exports.resizeImage=asyncHandler(async(req,res,next)=>{
const filename= `category-${uuidv4()}-${Date.now()}.jpeg`;

if(req.file){
  await sharp(req.file.buffer)
  .resize(600,600)
  .toFormat('jpeg')
  .jpeg({quality:95})
  .toFile(`uploads/categories/${filename}`);
  
  // save image after processing to the DB : 
  req.body.image=filename;
}
next();
});

// @disc get list of Categories
// @route GET /api/v1/categories
// @access Public
exports.getCategories = factroy.getAll(Category);

// @disc Create Category
// @route POST /api/v1/categories
// @access Private (admin)
exports.createCategory = factroy.createOne(Category);

// @disc get specific Category by id
// @route GET /api/v1/categories/id
// @access Private (admin)
exports.getCategory = factroy.getOne(Category);

// @disc update specific category
// @route GET /api/v1/categories/id
// @access Private (admin)
exports.updateCategory = factroy.updateOne(Category);

// @disc delete specific category
// @route GET /api/v1/categories/id
// @access Private (admin)
exports.deleteCategory = factroy.deleteOne(Category);
/* asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  // new: true return the ategory after updated if we dont put this will return the category before updated!
  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    return next(new ApiError(`No Category with id : ${id}`, 404));
  }
  res.status(204).send();
}); */
