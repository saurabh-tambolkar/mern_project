require("dotenv").config();
const express=require('express');
const app=express();
const path=require("path");
const hbs=require("hbs");

const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");

require("./db/conn");
const register=require("./models/registers")

const port=process.env.PORT || 8000;

console.log(process.env.SECRET_KEY);

app.use(express.json());
app.use(express.urlencoded({extended:false})) //imp
app.use(express.static("public"))

const template_path=path.join(__dirname,"../templates/views");
const partials_path=path.join(__dirname,"../templates/partials");
// console.log(temp_path);

app.set("views",template_path);
app.set("view engine","hbs");
hbs.registerPartials(partials_path);

app.get("/",async(req,res)=>{
    res.render("index");
});

app.get("/register",(req,res)=>{
    res.render("register")
})

//create new user from form
app.post("/register",async(req,res)=>{
    try{
        const password=req.body.password;
        const cpassword=req.body.confirmPassword;

        if(password===cpassword){
            const employee=new register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                phone: req.body.phone,
                age:req.body.age,
                password:req.body.password,
                // password:password, can also write like this
                confirmPassword:req.body.confirmPassword,
            })

            const token=await employee.generateAuthToken();
            console.log(`token is ${token}`);

            const registered=await employee.save();

            res.render("index"); 
        }
        else{
            res.send("passwords do not match");
        }
        
    }
    catch(err){
        res.send(err);
    }
})

app.get("/login",(req,res)=>{
    res.render("login")
})

app.post("/login",async(req,res)=>{

    try{
        const email=req.body.email;
        const password=req.body.password;


        const userEmail=await register.findOne({email:email});

        //bcrypt data comparing wih entered data
        const isMatch=await bcrypt.compare(password,userEmail.password);

        console.log(userEmail.email);
        // console.log(userEmail.password);

        const token=await userEmail.generateAuthToken();
        console.log(`token is ${token}`);

        // 
        if(isMatch){
            res.render("index");
        }
        else{
            res.send("invalid details");
        }
    }
    catch(er){
        res.status(404);
        res.render(er);
    }
})

// const securePassword=async(password)=>{
    
//      
//     console.log(hashedPassword);

//     const matchPassword=await bcrypt.compare(password,hashedPassword);
//     console.log(matchPassword)
// }

// securePassword("saurabh@22");



//create token
// const createToken=async()=>{
//     const token=await jwt.sign({_id:"175154487815487"},"isdhduhsuieyr8cyr8vyretv8reeytrtb",{expiresIn:"2 minutes"})
//     console.log(token);

//     const userVer=await jwt.verify(token,"isdhduhsuieyr8cyr8vyretv8reeytrtb");
//     console.log(userVer)
// }
// createToken();


// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9                         header
// .eyJfaWQiOiIxNzUxNTQ0ODc4MTU0ODciLCJpYXQiOjE2OTAzMTA1MzN9     payload
// .rsAizdgE-aw519PLplvo61refmtre0gn6txT2rhItZU                  

app.listen(port,()=>{
    console.log(`listening to port number : ${port}`);
});