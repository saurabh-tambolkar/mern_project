const mongoose=require("mongoose");

mongoose.connect(process.env.MONGODB_CONN,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{
    console.log('Connected to MongoDB successfully');
})
.catch((err)=>{
    console.error(`no connection due to : `,err);
});

