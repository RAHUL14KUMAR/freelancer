const expressAsyncHandler=require('express-async-handler');
const jwt=require('jsonwebtoken');
const users=require('../schema/userschema');

const protect=expressAsyncHandler(async(req,res,next)=>{
    let token;
    if(
        req.headers.authorization&&
        req.headers.authorization.startsWith('Bearer')
    ){
        try{
            token=req.headers.authorization.split(" ")[1];
            const decode=jwt.verify(token,process.env.JWT_SECRET);

            req.user=await users.findById(decode.id).select("-password");
            if(req.user===null){
                throw new Error();
            }
            next();
        }catch(error){
            res.status(401);
            throw new Error("unauthorized");
        }
    }

    if(!token){
        res.status(400);
        throw new Error("unauthorized, no token");
    }
})
module.exports=protect;