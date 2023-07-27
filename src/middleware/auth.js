const jwt=require("jsonwebtoken");
const register=require("../models/registers");

const auth=async(req,res,next)=>{
    try{
        const token=req.cookies.jwt;
        const verifyUser=jwt.verify(token,process.env.SECRET_KEY);
        console.log(verifyUser);

        const user=await register.findOne({_id:verifyUser._id});
        console.log(user.firstname);

        req.token=token;
        req.user=user;

        next();
    }
    catch(err){
        res.status(404);
        res.send("cant go to this page without logiing in");
        // res.send(err);
    }

}

module.exports=auth;
