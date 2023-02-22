const mongoose=require('mongoose');

const dbConnecction = ()=>{
    mongoose.connect(process.env.DB_URI).then((conn) =>{
        console.log(`database connected ${  conn.connection.host}`);
    })
    // .catch((err)=>{
    //     console.log('database error' + err);
    //     process.exit(1);
    // }
    // );
};

module.exports=dbConnecction;