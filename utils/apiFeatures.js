class ApiFeatures{
    constructor(mongooseQuery,queryString)
    {
    this.mongooseQuery=mongooseQuery;
    this.queryString=queryString;
}

filter(){
     // Filteration
  const queryStringObj={...this.queryString};
  const excluderFields=['page','sort','limit','fields'];
  excluderFields.forEach((field) =>delete queryStringObj[field]);


  //fiteration for grater than or equal and less than or equal
  let queryStr=JSON.stringify(queryStringObj);
  queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g,(match)=>`$${match}`);
  this.mongooseQuery=this.mongooseQuery.find(JSON.parse(queryStr));
  return this;
}

sort(){
    // Sorting 
if(this.queryString.sort){
    // split price,sold => [price, sold] then join [price sold]
    const sortBy = this.queryString.sort.split(',').join(' ');
  this.mongooseQuery=this.mongooseQuery.sort(sortBy);
  }else{
  this.mongooseQuery=this.mongooseQuery.sort('-createAt');
  }
  return this;
}

limitFields(){
    // Select Fields limiting 
if(this.queryString.fields){
    const fields = this.queryString.fields.split(',').join(' ');
    this.mongooseQuery=this.mongooseQuery.select(fields);
    }else{
      // Execulde the Field __v which mongodb inserted by defualt 
    this.mongooseQuery=this.mongooseQuery.select('-__v');
    }

    return this;
}

search(modelName){
    // Search Feature 
if(this.queryString.keyword){
    let query={};
    if(modelName=='Product') {
      query.$or=[
        //$options: "i" to search both Men or men samll or capital letters : Matching keywords
        {title:{$regex:this.queryString.keyword,$options:"i"}},{description:{$regex:this.queryString.keyword},$options:"i"},
      ];
    }else{
      query={name:{$regex:this.queryString.keyword,$options:"i"}};
    }
    this.mongooseQuery=this.mongooseQuery.find(query);
  }
  return this;
}

paginate(countDocuments){
    // Pagination
  // query string to send as a parameter in te url and * 1 to convert it to int and use (||) if there is no page selected (defualt)
  const page = this.queryString.page * 1 || 1;
  const limit = this.queryString.limit * 1 || 50;
  const skip = (page - 1) * limit; //(2-1) * 5 = 5 skip first documents and select the next 5 docs
  const endIndex=page * limit; //2*10 =20
  // pagination Result
  const pagination={};
  pagination.currentPage=page;
  pagination.limit=limit;
  // 50 docs / limit 10 / 5 pagesc, countDocumnets number of docs from db
  pagination.numberOfPages=Math.ceil(countDocuments/limit); // if 10/50= 0.2 , make defualt to 1
  // next page
  if(endIndex < countDocuments){
    pagination.next=page +1;
  }
  // previous page
  if(skip >0){
    pagination.prev=page-1;
  }
  this.mongooseQuery=this.mongooseQuery.skip(skip).limit(limit);
  // add property paginationREsult to access the pagination inside productServices
  this.paginationResult=pagination;
  return this;
}
}

module.exports=ApiFeatures;
