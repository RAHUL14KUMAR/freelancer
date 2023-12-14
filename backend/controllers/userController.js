const expressAsyncHandler=require('express-async-handler');
const userModel=require('../schema/userschema');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// register yourself as a user or a admin
const registerUser=expressAsyncHandler(async(req,res)=>{
    try{
        const {name,email,password}=req.body
        if(!name || !email || !password){
            res.status(400).json("enter all the details");
        }

        const userExists=await userModel.findOne({email});

        if(userExists){
            res.status(400).json("user is already exists with this email")
        }

        const salt=await bcrypt.genSalt(10);
        const hashPass=await bcrypt.hash(password,salt);

        const user=await userModel.create({
            name:name,
            email:email,
            password:hashPass
        })

        res.status(200).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            role:user.role,
            token:generateJWT(user._id)
        })

    }catch(error){
        console.log(error);
        res.status(500).json("error occur in registered user route")
    }
})

// login yourself as a user or a admin
const loginUser=expressAsyncHandler(async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            res.status(400).json("enter all the details");
        }

        const user=await userModel.findOne({email});
        if(user&&await bcrypt.compare(password,user.password)){
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateJWT(user.id),
            });
        }else{
            res.status(400);
            throw new Error("Wrong credentials");
        }
    }catch(error){
        res.status(500).json("error occur in login user route")
    }
})
const generateJWT=(id)=>{
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
}
module.exports={
    registerUser,
    loginUser
}