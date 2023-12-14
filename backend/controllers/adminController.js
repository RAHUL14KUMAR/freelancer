const expressAsyncHandler = require("express-async-handler")
const user=require('../schema/userschema')

// admin get all user details but without knowing the actual password of user
const getAllUser=expressAsyncHandler(async(req,res)=>{
    const users=await user.find({role:'USER'}).select('-password')
    res.status(200).json(users)
})


// assign a general user to the role admin
const updateUser=expressAsyncHandler(async(req,res)=>{
    try{
        const id=req.params.userId
        const {role}=req.user;
        if(role==='ADMIN'){
            const users=await user.findByIdAndUpdate(id,{$set:req.body},{new:true});
            await users.save();

            res.status(200).json("role has been updated of the user")
        }else{
            res.status(404).json("you are not the correct user to update!!!");
        }
    }catch(error){
        console.log(error);
        res.status(500).json("error has been occured in the update User by admin")
    }
})

module.exports={
    updateUser,getAllUser
}