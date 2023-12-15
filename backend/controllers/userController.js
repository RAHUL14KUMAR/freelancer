const expressAsyncHandler=require('express-async-handler');
const userModel=require('../schema/userschema');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const course=require('../schema/courseSchema');

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

// user can see his purchase course
const coursePurchaseByUser=expressAsyncHandler(async(req,res)=>{
    try{
        const{role,email}=req.user
        if(role==='USER'){
            const courses=await course.find({})
            const show=courses.filter((course)=>{
                return course.purchaseBy.includes(email)
            })

            if(show.length!=0){
                // res.status(200).json(show);
                const simple = show.map((course) => ({
                    courseName: course.courseName,
                    courseDescription: course.courseDescription,
                }));
                res.status(200).json(simple);
            }else{
                res.status(404).json("nothing in the bucket");
            }
        }
    }catch(error){
        console.log(error);
        res.status(500).json("error is occred in the coursePurchaseByUser")
    }
})

// user can now purchase the course
const courseToPurchase=expressAsyncHandler(async(req,res)=>{
    try{
        const id=req.params.courseId
        const{role,email}=req.user
        if(role==='USER'){
            const courses=await course.findById(id);
            if(courses){
                if(!courses.purchaseBy.includes(email)){
                    courses.purchaseBy.push(email);
                    await courses.save();

                    res.status(200).json("courses has been purchased");
                }else{
                    res.status(404).json("you have already purchase the course");
                }
            }
        }else{
            res.status(404).json("you are not the correct user for purchasing");
        }
    }catch(error){
        console.log(error);
        res.status(500).json("error is occured in courseToPurchase");
    }
})
const generateJWT=(id)=>{
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
}
module.exports={
    registerUser,
    loginUser,courseToPurchase,
    coursePurchaseByUser
}