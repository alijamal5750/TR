const mongoose=require('mongoose');

// 1-create Schema
const categorySchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Category required'],
        unique:[true,'Category must be unique'],
        minlength:[3,'Too short Category name'],
        maxlength:[32,'Too long Category name']
    },
    // slug put parameter to lowercase to access the categories !
    slug:{
        type:String,
        lowercase:true,
    },
    image:{
        type:String,
    },
    // timestamps used to select the modern records from the database : by date created and updated !
    },{timestamps:true});
    


    const setImageURL=(doc)=>{
// return image base url + image name : 
if(doc.image){
    const imageUrl=`${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image=imageUrl;
}
    };

    // get image url based on envionment : works with findall,update,get by id : 
   categorySchema.post('init',(doc)=>{
    setImageURL(doc);
   });

    // get image url based on envionment : works with Create :
   categorySchema.post('save',(doc)=>{
    setImageURL(doc);
   });

    // 2- Category Model
    const CategoryModel=mongoose.model('Category',categorySchema);

    module.exports=CategoryModel;