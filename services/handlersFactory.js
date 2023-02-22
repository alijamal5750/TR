const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures=require('../utils/apiFeatures');


exports.deleteOne=(Model)=>
asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // new: true return the ategory after updated if we dont put this will return the category before updated!
    const document = await Model.findByIdAndDelete(id);
    if (!document) {
      return next(new ApiError(`No document with id : ${id}`, 404));
    }

    // Trigger 'remove' event when update document (cacl in review Model) :
    document.remove();
    res.status(204).send();
  });

  exports.updateOne=(Model)=>asyncHandler(async (req, res, next) => {
 
    // for slug add the validation to validation.js or create new middleware and add it to routes before update
    
     const documnet = await Model.findByIdAndUpdate(
       req.params.id,
       req.body,
       { new: true }
     );
   
     if (!documnet) {
       return next(new ApiError(`No documnet with id : ${id}`, 404));
     }

     // Trigger 'save' event when update document (cacl in review Model) :
     documnet.save();
     res.status(200).json({ data: documnet });
   });


   exports.createOne=(Model) =>
   asyncHandler(async (req, res) => {
    const document = await Model.create( req.body );
    res.status(201).json({ data: document });
  });

  exports.getOne=(Model,populationOpt)=>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // 1- Build Query
    let query =  Model.findById(id);

    if(populationOpt){
      query = query.populate(populationOpt);
    }
    // 2- Execute query : 
    const document=await query;
    if (!document) {
      // res.status(404).json({msg : 'No Brand for this id : ' + id});
      return next(new ApiError(`No document with id : ${id}`, 404));
    }
    res.status(200).json({ data: document });
  });

exports.getAll=(Model,ModelName='')=>
asyncHandler(async (req, res,next) => {
  // filter to apply nested route accessing get subcategories by categoryId :
  let filter={};
  if(req.filterObj){
    filter=req.filterObj;
  }
  // to get the count of docs in db,send as a parameter in paginate
  const documentsCount=await Model.countDocuments();
  
  // Build Query
const apiFeatures=new ApiFeatures(Model.find(filter),req.query).paginate(documentsCount).filter()
.limitFields().search(ModelName).sort();
 
  const{mongooseQuery,paginationResult}=apiFeatures;
  const documents = await mongooseQuery;
  res.status(200).json({ results: documents.length, paginationResult, data: documents });
});