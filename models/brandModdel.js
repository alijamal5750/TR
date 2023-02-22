const mongoose=require('mongoose');

// 1-create Schema
const brandSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'brand required'],
        unique:[true,'brand must be unique'],
        minlength:[3,'Too short brand name'],
        maxlength:[32,'Too long brand name']
    },
    // slug put parameter to lowercase to access the brands !
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
            const imageUrl=`${process.env.BASE_URL}/brands/${doc.image}`;
            doc.image=imageUrl;
        }
            };
        
            // get image url based on envionment : works with findall,update,get by id : 
           brandSchema.post('init',(doc)=>{
            setImageURL(doc);
           });
        
            // get image url based on envionment : works with Create :
           brandSchema.post('save',(doc)=>{
            setImageURL(doc);
           });


    // 2- Category Model
module.exports=mongoose.model('Brand',brandSchema);
