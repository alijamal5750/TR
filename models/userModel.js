const  mongoose  = require("mongoose")
const bcrypt=require('bcryptjs');

const userSchema=new mongoose.Schema(
{
    name:{
        type:String,
        trim:true,
        required:[true,'name required'],
    },
    slug:{
        type:String,
        lowercase:true,
    },
    email:{
        type:String,
        required:[true,'Email required'],
        unique:true,
        lowercase:true,
    },

    phone:String,

    profileImg:String,
    
    password:{
        type:String,
        required:[true,'password required'],
        minlength:[6,'Too Short Password'],
    },
    
    passwordChangedAt:Date,
    passwordResetCode:String,
    PasswordResetExpires:Date,
    passwordResetVerified:Boolean,

    role:{
        type:String,
        // enum to specify role in system, not apply anything else out of enum 
        enum:['user','manager','admin'],
        default:'user',
    },
    active:{
        type:Boolean,
        default:true,
    },
    // child refrence : one to many  array[]
    wishlist:[{
        type:mongoose.Schema.ObjectId,
        ref:'Product',
    }],
    // ember documnet : 
    addresses:[
        {
            id:{type:mongoose.Schema.Types.ObjectId},// generate unqie id 
            alias:String,//Subject
            details:String,
            phone:String,
            city:String,
            postalCode:String,
        },
    ],
},
{timestamps:true}
);

// Bycryptjs Password : on Create User
userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();
    // Hasing user password : 
    this.password=await bcrypt.hash(this.password,12);
    next();
});

const user=mongoose.model('User',userSchema);

module.exports=user;